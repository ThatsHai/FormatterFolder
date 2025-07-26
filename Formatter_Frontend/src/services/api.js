// import axios from "axios";
// //accessToken is saved inside session storage

// const api = axios.create({
//   baseURL: "http://localhost:8080",
// });

// api.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const { response, config } = error;

//     if (response) {
//       const { status, data } = response;

//       if (status === 401 && !config._retry) {
//         console.log("401 Unauthorized. Trying to refresh token...");

//         config._retry = true;
//         try {
//           await refreshToken(); // If this succeeds, we retry original request
//           console.log("Refreshed done");
//           return api(config); // Retry original request with new token
//         } catch (refreshError) {
//           console.error("Token refresh failed:", refreshError);
//           alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
//           window.location.replace("/login");
//         }
//       } else {
//         console.log(`API error [${status}]:`, data);
//       }
//     } else {
//       console.log("Network or CORS error:", error.message);
//     }

//     return Promise.reject(error);
//   }
// );

// const refreshToken = async () => {
//   try {
//     const response = await refreshTokenApi.post(
//       "http://localhost:8080/auth/refresh"
//     );
//     sessionStorage.setItem("accessToken", response.data.result.accesstoken);

//     return response;
//   } catch (e) {
//     console.log("Error refreshing token:", e);
//     throw e;
//   }
// };

// export const noTokenApi = axios.create({
//   baseURL: "http://localhost:8080",
// });

// export const refreshTokenApi = axios.create({
//   baseURL: "http://localhost:8080",
//   withCredentials: true,
// });

// export default api;


import axios from "axios";

const API_BASE = "http://localhost:8080";

//noTokenApi used for sign up, refreshTokenApi use for refreshing token
export const noTokenApi = axios.create({ baseURL: API_BASE });

export const refreshTokenApi = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

const api = axios.create({ baseURL: API_BASE });

/* ------------------- shared state ------------------- */
let isRefreshing = false;
let refreshPromise = null;
let requestQueue = [];
let didHandleSessionExpire = false; // <- prevent double alert/redirect

const onRefreshed = (token) => {
  requestQueue.forEach(({ resolve, config }) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    resolve(api(config));
  });
  requestQueue = [];
};

const onRefreshedError = (err) => {
  requestQueue.forEach(({ reject }) => reject(err));
  requestQueue = [];
};

const handleSessionExpiredOnce = () => {
  if (didHandleSessionExpire) return;
  didHandleSessionExpire = true;
  alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
  window.location.replace("/login");
};

//token helpers
const saveAccessToken = (token) => {
  sessionStorage.setItem("accessToken", token);
};

const getAccessToken = () => sessionStorage.getItem("accessToken");

//axios wiring
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;

    if (!response) {
      // Network/CORS error
      return Promise.reject(error);
    }

    const { status } = response;

    if (status !== 401) {
      return Promise.reject(error);
    }

    // Avoid looping
    if (config._retry) {
      // We've already tried once – give up
      handleSessionExpiredOnce();
      return Promise.reject(error);
    }
    config._retry = true;

    // Queue the current request
    const retry = new Promise((resolve, reject) => {
      requestQueue.push({ resolve, reject, config });
    });

    try {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshTokenApi
          .post("/auth/refreh")
          .then((res) => {
            const newToken =
              res.data?.result?.accessToken ??
              res.data?.result?.accesstoken; // handle both spellings
            if (!newToken) throw new Error("No token in refresh response");
            saveAccessToken(newToken);
            onRefreshed(newToken);
            return newToken;
          })
          .catch((e) => {
          onRefreshedError(e);
          handleSessionExpiredOnce();
          throw e;
        })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      await refreshPromise;
      return retry;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

export default api;
