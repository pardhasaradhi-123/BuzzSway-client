// utils/axios.js
import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // optional: for sending cookies
});

// ✅ Automatically attach token from cookies
API.interceptors.request.use((config) => {
  const token = Cookies.get("token"); // 🔑 get token from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
