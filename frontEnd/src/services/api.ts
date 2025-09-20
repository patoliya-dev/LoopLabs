import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

// API Configuration
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const TIMEOUT = 30000; // 30 seconds

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for additional headers
apiClient.interceptors.request.use(
  (config) => {
    // Add any additional headers if needed
    config.headers["X-Client-Version"] = "1.0.0";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Enhanced error logging
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
      },
    });

    return Promise.reject(error);
  }
);

export default apiClient;
export { BASE_URL };
