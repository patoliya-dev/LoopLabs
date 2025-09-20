import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import type { VoiceChatRequest, VoiceChatResponse } from "../services/api";
import type { CreateChatRequest, ChatResponse } from "../services/chatService";

// Hook for sending voice messages
export const useVoiceChat = () => {
  const queryClient = useQueryClient();

  return useMutation<VoiceChatResponse, Error, VoiceChatRequest>({
    mutationFn: (voiceRequest: VoiceChatRequest) =>
      chatService.sendVoiceMessage(voiceRequest),
    onSuccess: (data) => {
      // Optionally invalidate and refetch chat sessions or messages
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
      console.log("Voice message sent successfully:", data);
    },
    onError: (error) => {
      console.error("Voice message failed:", error);
    },
  });
};

// Hook for sending text messages
export const useTextChat = () => {
  const queryClient = useQueryClient();

  return useMutation<ChatResponse, Error, CreateChatRequest>({
    mutationFn: (textRequest: CreateChatRequest) =>
      chatService.sendMessage(textRequest),
    onSuccess: (data) => {
      // Optionally invalidate and refetch chat sessions or messages
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
      console.log("Text message sent successfully:", data);
    },
    onError: (error) => {
      console.error("Text message failed:", error);
    },
  });
};

// Hook for handling chat state and combining voice/text functionality
export const useChat = () => {
  const voiceChat = useVoiceChat();
  const textChat = useTextChat();

  const sendVoice = async (
    audioBlob: Blob,
    sessionId?: string,
    language?: string
  ) => {
    return voiceChat.mutateAsync({
      audioBlob,
      sessionId,
      language,
    });
  };

  const sendText = async (message: string, sessionId?: string) => {
    return textChat.mutateAsync({
      message,
      sessionId,
    });
  };

  return {
    sendVoice,
    sendText,
    isVoiceLoading: voiceChat.isPending,
    isTextLoading: textChat.isPending,
    voiceError: voiceChat.error,
    textError: textChat.error,
    voiceData: voiceChat.data,
    textData: textChat.data,
  };
};
