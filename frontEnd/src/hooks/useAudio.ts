import { useState, useEffect, useCallback } from "react";
import { audioService } from "../services/audioService";
import { chatService } from "../services/chatService";
import type { AudioRecordingState, AudioPlaybackState } from "../types/chat";

export interface UseAudioReturn {
  recordingState: AudioRecordingState;
  playbackState: AudioPlaybackState;
  hasPermission: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  playAudio: (audioUrl: string, messageId: string) => Promise<void>;
  stopAudio: () => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  transcribeAudio: (audioBlob: Blob) => Promise<string>;
  synthesizeSpeech: (text: string, emotion?: string) => Promise<string>;
  requestPermission: () => Promise<boolean>;
}

export function useAudio(): UseAudioReturn {
  const [recordingState, setRecordingState] = useState<AudioRecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 0,
  });

  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    messageId: "",
  });

  const [hasPermission, setHasPermission] = useState(false);

  // Initialize audio service event handlers
  useEffect(() => {
    audioService.setRecordingStateHandler((state) => {
      setRecordingState(state as AudioRecordingState);
    });

    audioService.setPlaybackStateHandler((state) => {
      setPlaybackState(state as AudioPlaybackState);
    });

    // Check for existing permission on mount
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setHasPermission(true);
      })
      .catch(() => {
        setHasPermission(false);
      });

    // Cleanup on unmount
    return () => {
      audioService.cleanup();
    };
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const granted = await audioService.requestMicrophonePermission();
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      setHasPermission(false);
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error("Microphone permission denied");
        }
      }

      await audioService.startRecording();
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }, [hasPermission, requestPermission]);

  const stopRecording = useCallback(async () => {
    try {
      const audioBlob = await audioService.stopRecording();
      return audioBlob;
    } catch (error) {
      console.error("Error stopping recording:", error);
      throw error;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    audioService.pauseRecording();
  }, []);

  const resumeRecording = useCallback(() => {
    audioService.resumeRecording();
  }, []);

  const playAudio = useCallback(async (audioUrl: string, messageId: string) => {
    try {
      await audioService.playAudio(audioUrl, messageId);
    } catch (error) {
      console.error("Error playing audio:", error);
      throw error;
    }
  }, []);

  const stopAudio = useCallback(() => {
    audioService.stopAudio();
  }, []);

  const pauseAudio = useCallback(() => {
    audioService.pauseAudio();
  }, []);

  const resumeAudio = useCallback(() => {
    audioService.resumeAudio();
  }, []);

  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    try {
      const transcription = await chatService.voiceToText({
        audioBlob,
        language: "en-US", // You can make this configurable
      });
      return transcription;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw error;
    }
  }, []);

  const synthesizeSpeech = useCallback(
    async (text: string, emotion?: string) => {
      try {
        const audioUrl = await chatService.textToSpeech({
          text,
          emotion,
          voice: "default", // You can make this configurable
        });
        return audioUrl;
      } catch (error) {
        console.error("Error synthesizing speech:", error);
        throw error;
      }
    },
    []
  );

  return {
    recordingState,
    playbackState,
    hasPermission,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    playAudio,
    stopAudio,
    pauseAudio,
    resumeAudio,
    transcribeAudio,
    synthesizeSpeech,
    requestPermission,
  };
}
