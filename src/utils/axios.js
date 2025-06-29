import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: "https://buzzsway-server-production.up.railway.app/api",
});

// Attach token from cookie to header
API.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
