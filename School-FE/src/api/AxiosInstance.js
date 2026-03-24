import axios from "axios";

const AUTH_ENDPOINTS = [
  "/api/users/login",
  "/api/users/register",
  "/api/students/register",
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
  const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => config.url?.includes(ep));
  if (!isAuthEndpoint) {
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
