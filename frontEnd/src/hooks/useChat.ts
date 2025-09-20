import { useState, useEffect, useCallback } from "react";
import { chatService } from "../services/chatService";
import { wsService } from "../services/websocketService";
import type { Message, ChatSession, LoadingState } from "../types/chat";

export interface UseChatReturn {
  messages: Message[];
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  createNewSession: (title?: string) => Promise<void>;
  switchSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearError: () => void;
  retryConnection: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState<unknown>>({
    isLoading: false,
    error: null,
    data: null,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const loadChatSessions = useCallback(async () => {
    try {
      setLoadingState((prev) => ({ ...prev, isLoading: true, error: null }));
      const { sessions: loadedSessions } = await chatService.getChatSessions();
      setSessions(loadedSessions);

      // Set current session to the most recent one if none selected
      if (!currentSessionId && loadedSessions.length > 0) {
        setCurrentSessionId(loadedSessions[0].id);
      }
    } catch (error) {
      setLoadingState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to load sessions",
      }));
    } finally {
      setLoadingState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [currentSessionId]);

  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      setLoadingState((prev) => ({ ...prev, isLoading: true, error: null }));
      const { messages: loadedMessages } = await chatService.getSessionMessages(
        sessionId
      );
      setMessages(loadedMessages);
    } catch (error) {
      setLoadingState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to load messages",
      }));
    } finally {
      setLoadingState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        await wsService.connect();
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
      }
    };

    initializeConnection();

    // WebSocket event listeners
    wsService.on("connected", () => {
      setIsConnected(true);
    });

    wsService.on("disconnected", () => {
      setIsConnected(false);
    });

    wsService.on("message", (data) => {
      const messageData = data as {
        message: string;
        sessionId: string;
        emotion?: string;
        timestamp: string;
      };
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: messageData.message,
        timestamp: new Date(messageData.timestamp),
        emotion: messageData.emotion,
        sessionId: messageData.sessionId,
      };

      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(false);
    });

    wsService.on("typing", (data) => {
      const typingData = data as { isTyping: boolean; sessionId: string };
      if (typingData.sessionId === currentSessionId) {
        setIsTyping(typingData.isTyping);
      }
    });

    wsService.on("error", (data) => {
      const errorData = data as { error: string };
      setLoadingState((prev) => ({ ...prev, error: errorData.error }));
    });

    return () => {
      wsService.disconnect();
    };
  }, [currentSessionId]);

  // Load chat sessions on mount
  useEffect(() => {
    loadChatSessions();
  }, [loadChatSessions]);

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      loadSessionMessages(currentSessionId);
    }
  }, [currentSessionId, loadSessionMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      try {
        setLoadingState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Create user message immediately
        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: content.trim(),
          timestamp: new Date(),
          sessionId: currentSessionId || undefined,
        };

        setMessages((prev) => [...prev, userMessage]);

        // Send message to backend
        const response = await chatService.sendMessage({
          message: content.trim(),
          sessionId: currentSessionId || undefined,
        });

        // Update current session if new one was created
        if (!currentSessionId && response.sessionId) {
          setCurrentSessionId(response.sessionId);
          await loadChatSessions(); // Reload sessions to include the new one
        }

        // If not using WebSocket, add AI response directly
        if (!isConnected) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content: response.message,
            timestamp: new Date(response.timestamp),
            emotion: response.emotion,
            audioUrl: response.audioUrl,
            sessionId: response.sessionId,
          };

          setMessages((prev) => [...prev, aiMessage]);
        } else {
          // Show typing indicator for WebSocket
          setIsTyping(true);
        }
      } catch (error) {
        setLoadingState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Failed to send message",
        }));
      } finally {
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [currentSessionId, isConnected, loadChatSessions]
  );

  const createNewSession = useCallback(async (title?: string) => {
    try {
      setLoadingState((prev) => ({ ...prev, isLoading: true, error: null }));
      const newSession = await chatService.createSession(title);
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
    } catch (error) {
      setLoadingState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to create session",
      }));
    } finally {
      setLoadingState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const switchSession = useCallback(async (sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await chatService.deleteSession(sessionId);
        setSessions((prev) =>
          prev.filter((session) => session.id !== sessionId)
        );

        // Switch to another session if the current one was deleted
        if (currentSessionId === sessionId) {
          const remainingSessions = sessions.filter((s) => s.id !== sessionId);
          setCurrentSessionId(
            remainingSessions.length > 0 ? remainingSessions[0].id : null
          );
          setMessages([]);
        }
      } catch (error) {
        setLoadingState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Failed to delete session",
        }));
      }
    },
    [currentSessionId, sessions]
  );

  const clearError = useCallback(() => {
    setLoadingState((prev) => ({ ...prev, error: null }));
  }, []);

  const retryConnection = useCallback(async () => {
    try {
      await wsService.connect();
    } catch (error) {
      console.error("Failed to retry connection:", error);
    }
  }, []);

  return {
    messages,
    sessions,
    currentSessionId,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    isConnected,
    isTyping,
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    clearError,
    retryConnection,
  };
}
