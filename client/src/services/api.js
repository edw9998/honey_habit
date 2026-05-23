// client/src/services/api.js
import axios from "axios";

// Fixed: Added missing slash. Add /api if your routes are under /api/
const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;