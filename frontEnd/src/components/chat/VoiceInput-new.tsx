import { useState, useCallback, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Play, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

interface VoiceInputProps {
  onSendMessage: (message: string) => void;
  onSendVoiceMessage?: (audioBlob: Blob) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  sessionId?: string;
}

export function VoiceInput({
  onSendMessage,
  onSendVoiceMessage,
  disabled = false,
  placeholder = "Type a message or hold to record...",
  className,
  sessionId,
}: VoiceInputProps) {
  const [textMessage, setTextMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingInterval, setRecordingInterval] =
    useState<NodeJS.Timeout | null>(null);

  const { settings } = useSettings();
  const { sendVoice, isVoiceLoading, voiceError } = useChat();

  // Audio recording state handlers
  const handleRecordingStateChange = useCallback(
    (state: AudioRecordingState) => {
      setRecordingDuration(state.duration);
      setAudioLevel(state.audioLevel);
    },
    []
  );

  // Set up audio service event handler
  useState(() => {
    audioService.setRecordingStateHandler(handleRecordingStateChange);
  });

  const handleSendText = useCallback(() => {
    if (textMessage.trim() && !disabled) {
      onSendMessage(textMessage.trim());
      setTextMessage("");
    }
  }, [textMessage, disabled, onSendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendText();
      }
    },
    [handleSendText]
  );

  const handleStartRecording = useCallback(async () => {
    if (!settings.microphoneEnabled) {
      alert("Microphone access is disabled in settings");
      return;
    }

    try {
      const hasPermission = await audioService.requestMicrophonePermission();
      if (!hasPermission) {
        alert("Microphone permission is required for voice input");
        return;
      }

      setIsRecording(true);
      await audioService.startRecording();

      // Start duration timer
      const interval = setInterval(() => {
        const state = audioService.getRecordingState();
        if (state.isRecording) {
          setRecordingDuration(state.duration);
          setAudioLevel(state.audioLevel);
        }
      }, 100);

      setRecordingInterval(interval);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Failed to start recording. Please try again.");
      setIsRecording(false);
    }
  }, [settings.microphoneEnabled]);

  const handleStopRecording = useCallback(async () => {
    if (!isRecording) return;

    try {
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }

      const audioBlob = await audioService.stopRecording();
      setIsRecording(false);
      setRecordingDuration(0);
      setAudioLevel(0);

      if (audioBlob) {
        if (onSendVoiceMessage) {
          // Send voice message directly to parent component
          onSendVoiceMessage(audioBlob);
        } else {
          // Send voice message through the voice chat hook
          try {
            const response = await sendVoice(
              audioBlob,
              sessionId,
              settings.language
            );
            if (response?.message) {
              // Handle the response (e.g., display it in chat)
              console.log("Voice message response:", response);
            }
          } catch (error) {
            console.error("Failed to send voice message:", error);
            alert("Failed to send voice message. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      setIsRecording(false);
      setRecordingDuration(0);
      setAudioLevel(0);
    }
  }, [
    isRecording,
    recordingInterval,
    onSendVoiceMessage,
    sendVoice,
    sessionId,
    settings.language,
  ]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className={cn("p-4", className)}>
      {/* Recording Status */}
      {isRecording && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Recording
              </span>
              <Badge variant="secondary" className="text-xs">
                {formatDuration(recordingDuration)}
              </Badge>
            </div>
          </div>

          {/* Audio Level Indicator */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Audio Level</div>
            <Progress value={audioLevel * 100} className="h-2" />
          </div>
        </div>
      )}

      {/* Voice Processing Status */}
      {isVoiceLoading && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Processing voice message...
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {voiceError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/30">
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-700 dark:text-red-300">
              Voice message failed: {voiceError.message}
            </span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-3 items-end">
        {/* Text Input */}
        <div className="flex-1">
          <Textarea
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isRecording || isVoiceLoading}
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
        </div>

        {/* Voice Record Button */}
        <Button
          size="lg"
          variant={isRecording ? "destructive" : "outline"}
          disabled={disabled || isVoiceLoading || !settings.microphoneEnabled}
          onMouseDown={handleStartRecording}
          onMouseUp={handleStopRecording}
          onMouseLeave={handleStopRecording}
          onTouchStart={handleStartRecording}
          onTouchEnd={handleStopRecording}
          className={cn(
            "h-11 w-11 p-0 transition-all duration-200",
            isRecording && "animate-pulse scale-110"
          )}
          title={
            !settings.microphoneEnabled
              ? "Microphone disabled in settings"
              : "Hold to record voice message"
          }
        >
          {isRecording ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic
              className={cn(
                "w-5 h-5",
                !settings.microphoneEnabled && "opacity-50"
              )}
            />
          )}
        </Button>

        {/* Send Button */}
        <Button
          size="lg"
          onClick={handleSendText}
          disabled={
            !textMessage.trim() || disabled || isRecording || isVoiceLoading
          }
          className="h-11 w-11 p-0"
        >
          {isVoiceLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Helper Text */}
      <div className="mt-2 text-xs text-muted-foreground">
        {isRecording
          ? "Release to stop recording"
          : !settings.microphoneEnabled
          ? "Enable microphone in settings to use voice input"
          : "Press Enter to send • Hold mic button to record"}
      </div>
    </Card>
  );
}
