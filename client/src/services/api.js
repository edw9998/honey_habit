// client/src/services/api.js
import axios from "axios";

// 1. Set the Base URL
const API = axios.create({ baseURL: "http://localhost:5000/api" });

// 2. Interceptor: Attaches the Token to EVERY request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Format must be: "Bearer <token>"
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;