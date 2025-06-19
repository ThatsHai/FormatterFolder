import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

<<<<<<< Updated upstream
=======
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response, config } = error;

    if (response) {
      const { status, data } = response;

      if (status === 401 && !config._retry) {
        console.log("401 Unauthorized. Trying to refresh token...");

        config._retry = true;
        try {
          await refreshToken(); // If this succeeds, we retry original request
          console.log("Refreshed done");
          return api(config); // 🔁 Retry original request with new token
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      } else {
        console.log(`API error [${status}]:`, data);
      }
    } else {
      console.log("Network or CORS error:", error.message);
    }

    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const response = await refreshTokenApi.post(
      "http://localhost:8080/auth/refresh"
    );
    sessionStorage.setItem("accessToken", response.data.result.accesstoken);
    return response;
  } catch (e) {
    console.log("Error refreshing token:", e);
    throw e;
  }
};

export const noTokenApi = axios.create({
  baseURL: "http://localhost:8080",
});

const refreshTokenApi = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

>>>>>>> Stashed changes
export default api;
