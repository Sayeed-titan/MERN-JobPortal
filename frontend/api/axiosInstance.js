import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
});

// Optional: attach token for protected routes
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
