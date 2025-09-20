import apiClient from "./api";
import type { Message } from "../types/chat";

export interface CreateChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  emotion?: string;
  audioUrl?: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  language: string;
}

export interface VoiceToTextRequest {
  audioBlob: Blob;
  language?: string;
}

export interface TextToSpeechRequest {
  text: string;
  voice?: string;
  emotion?: string;
}

class ChatService {
  // Send a message to the AI
  async sendMessage(request: CreateChatRequest): Promise<ChatResponse> {
    try {
      const response = await apiClient.post("/chat/message", request);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message");
    }
  }

  // Get chat sessions/conversations
  async getChatSessions(
    page = 1,
    limit = 20
  ): Promise<{ sessions: ChatSession[]; total: number }> {
    try {
      const response = await apiClient.get(
        `/chat/sessions?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      throw new Error("Failed to fetch chat sessions");
    }
  }

  // Get messages for a specific session
  async getSessionMessages(
    sessionId: string,
    page = 1,
    limit = 50
  ): Promise<{ messages: Message[]; total: number }> {
    try {
      const response = await apiClient.get(
        `/chat/sessions/${sessionId}/messages?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching session messages:", error);
      throw new Error("Failed to fetch session messages");
    }
  }

  // Delete a chat session
  async deleteSession(sessionId: string): Promise<void> {
    try {
      await apiClient.delete(`/chat/sessions/${sessionId}`);
    } catch (error) {
      console.error("Error deleting session:", error);
      throw new Error("Failed to delete session");
    }
  }

  // Convert voice to text
  async voiceToText(request: VoiceToTextRequest): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("audio", request.audioBlob);
      if (request.language) {
        formData.append("language", request.language);
      }

      const response = await apiClient.post("/voice/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.text;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw new Error("Failed to transcribe audio");
    }
  }

  // Convert text to speech
  async textToSpeech(request: TextToSpeechRequest): Promise<string> {
    try {
      const response = await apiClient.post("/voice/synthesize", request, {
        responseType: "blob",
      });

      // Create a blob URL for the audio
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Error synthesizing speech:", error);
      throw new Error("Failed to synthesize speech");
    }
  }

  // Start a new chat session
  async createSession(title?: string): Promise<ChatSession> {
    try {
      const response = await apiClient.post("/chat/sessions", { title });
      return response.data;
    } catch (error) {
      console.error("Error creating session:", error);
      throw new Error("Failed to create session");
    }
  }

  // Update session title
  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    try {
      await apiClient.patch(`/chat/sessions/${sessionId}`, { title });
    } catch (error) {
      console.error("Error updating session title:", error);
      throw new Error("Failed to update session title");
    }
  }
}

export const chatService = new ChatService();
