export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  emotion?: string;
  isPlaying?: boolean;
  audioUrl?: string;
  sessionId?: string;
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

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  voice: string;
  autoPlay: boolean;
  notifications: boolean;
}

export interface VoiceSettings {
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface LoadingState<T = unknown> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
}

// WebSocket message types
export interface WebSocketMessage {
  type: "message" | "typing" | "error" | "connected" | "disconnected";
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface TypingIndicator {
  isTyping: boolean;
  sessionId: string;
}

// Audio related types
export interface AudioRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioLevel: number;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  messageId: string;
}
