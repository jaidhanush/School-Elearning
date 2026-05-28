import axios from "axios";

// Always public regardless of HTTP method
const PUBLIC_ENDPOINTS = [
  "/api/users/login",
  "/api/users/register",
  "/api/users/refresh",
  "/api/users/forgetpassword",
  "/api/users/forget-reset",
  "/api/students/register",
  "/api/payment",
  "/api/files",
  "/api/special-course-resources",
];

// Public only for GET requests
const PUBLIC_GET_ENDPOINTS = [
  "/api/departments",
];

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase();
  const isPublic =
    PUBLIC_ENDPOINTS.some((ep) => config.url?.includes(ep)) ||
    (method === "GET" && PUBLIC_GET_ENDPOINTS.some((ep) => config.url?.includes(ep)));
  if (!isPublic) {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
