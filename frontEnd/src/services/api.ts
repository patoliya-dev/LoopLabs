import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

// API Configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
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

// Voice Chat API Functions
export interface VoiceChatRequest {
  audioBlob: Blob;
  sessionId?: string;
  language?: string;
}

export interface VoiceChatResponse {
  message: string;
  audioUrl?: string;
  sessionId: string;
  emotion?: string;
  timestamp: string;
}

export const voiceChatAPI = {
  // Send voice audio to /chat endpoint
  async sendVoiceMessage(
    request: VoiceChatRequest
  ): Promise<VoiceChatResponse> {
    const formData = new FormData();
    formData.append("audio", request.audioBlob, "voice-message.webm");

    if (request.sessionId) {
      formData.append("sessionId", request.sessionId);
    }

    if (request.language) {
      formData.append("language", request.language);
    }

    const response = await apiClient.post("/chat", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // Extended timeout for voice processing
    });

    return response.data;
  },

  // Send text message to /chat endpoint
  async sendTextMessage(
    message: string,
    sessionId?: string
  ): Promise<VoiceChatResponse> {
    const response = await apiClient.post("/chat", {
      message,
      sessionId,
    });

    return response.data;
  },
};

export default apiClient;
export { BASE_URL };
