import axios from "axios";
import {authStorage} from "../utils/authStorage";
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ,
    headers:{
        "Content-Type":"application/json"
    }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smart_leads_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status;

    if (statusCode === 401) {
      authStorage.clearAuth();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);