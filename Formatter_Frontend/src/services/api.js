import axios from "axios";
//accessToken is saved inside session storage

const api = axios.create({
  baseURL: "http://localhost:8080",
});

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
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.warn("Token may exired");
      }
    }
    return Promise.reject(error);
  }
);

export const noTokenApi = axios.create({
  baseURL: "http://localhost:8080",
});

export default api;
