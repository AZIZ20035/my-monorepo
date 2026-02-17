import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Use local API proxy to handle cross-origin cookie issues
// The proxy at /api/* forwards requests to the backend
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor (No longer needs to add Authorization header)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Extract message from ApiResponse envelope if available
    const apiResponse = error.response?.data as any;
    if (apiResponse && apiResponse.message) {
      error.message = apiResponse.message;
    }

    // NOTE: 401 handling removed to prevent infinite redirect loops
    // The backend auth_token cookie is cross-origin blocked in development
    // Components should handle 401 errors individually if needed
    
    return Promise.reject(error);
  }
);

export default api;
