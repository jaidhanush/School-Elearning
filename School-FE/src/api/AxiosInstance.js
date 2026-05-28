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
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Request Interceptor — never send token on auth endpoints
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

// Response Interceptor — only clear session on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      clearSession();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
