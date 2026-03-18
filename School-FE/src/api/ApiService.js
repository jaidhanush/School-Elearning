import api from "./AxiosInstance";
// console.log(data)
const ApiService = {
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  delete: (url) => api.delete(url),
  handleAxiosError: (error, defaultMessage) => {
    if (error.detail) {
      return error.detail?.message || "Server error occurred";
    }
    if (error.response) {
      if (error.response.data?.detail?.error) {
        return error.response.data?.detail?.error || "Server error occurred";
      }
      return error.response.data?.detail || "Server error occurred";
    }
    if (error.request) {
      return "No response from server. Please check your internet connection.";
    }
    if (error.error) {
      return error.error;
    }
    return error.message || defaultMessage || "Something went wrong";
  },
};

export default ApiService;
