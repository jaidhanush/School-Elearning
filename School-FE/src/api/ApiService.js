import api from "./AxiosInstance";
// console.log(data)
const ApiService = {
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url) => api.delete(url),
  handleAxiosError: (error, defaultMessage) => {
    if (error.detail) {
      return error.detail?.message || "Server error occurred";
    }
    if (error.response) {
      const data = error.response.data;
      // Field validation errors: { "user.password": "msg", ... }
      if (data && typeof data === "object" && !data.detail && !data.message) {
        const messages = Object.values(data).filter(Boolean);
        if (messages.length) return messages.join(" | ");
      }
      if (data?.detail?.error) return data.detail.error;
      if (data?.detail) return data.detail;
      if (data?.message) return data.message;
      return "Server error occurred";
    }
    if (error.request) {
      return "No response from server. Please check your internet connection.";
    }
    if (error.error) return error.error;
    return error.message || defaultMessage || "Something went wrong";
  },
};

export default ApiService;
