import { useState, useCallback } from "react";
import { Mic, MicOff, Send, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { useAudio } from "../../hooks/useAudio";

interface VoiceInputProps {
  onSendMessage: (message: string) => void;
  onSendVoiceMessage?: (audioBlob: Blob) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function VoiceInput({
  onSendMessage,
  onSendVoiceMessage,
  disabled = false,
  placeholder = "Type a message or hold to record...",
  className,
}: VoiceInputProps) {
  const [textMessage, setTextMessage] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  const {
    recordingState,
    hasPermission,
    startRecording,
    stopRecording,
    transcribeAudio,
    requestPermission,
  } = useAudio();

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
    try {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          alert("Microphone permission is required for voice input");
          return;
        }
      }

      await startRecording();
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Failed to start recording. Please try again.");
    }
  }, [hasPermission, requestPermission, startRecording]);

  const handleStopRecording = useCallback(async () => {
    try {
      const audioBlob = await stopRecording();

      if (audioBlob && onSendVoiceMessage) {
        onSendVoiceMessage(audioBlob);
      } else if (audioBlob) {
        // Transcribe and send as text
        setIsTranscribing(true);
        try {
          const transcribedText = await transcribeAudio(audioBlob);
          if (transcribedText.trim()) {
            onSendMessage(transcribedText.trim());
          }
        } catch (error) {
          console.error("Transcription failed:", error);
          alert("Failed to transcribe audio. Please try typing instead.");
        } finally {
          setIsTranscribing(false);
        }
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  }, [stopRecording, onSendVoiceMessage, onSendMessage, transcribeAudio]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className={cn("p-4", className)}>
      {/* Recording Status */}
      {recordingState.isRecording && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Recording
              </span>
              <Badge variant="secondary" className="text-xs">
                {formatDuration(recordingState.duration)}
              </Badge>
            </div>

            {recordingState.isPaused && (
              <Badge variant="outline" className="text-xs">
                Paused
              </Badge>
            )}
          </div>

          {/* Audio Level Indicator */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Audio Level</div>
            <Progress value={recordingState.audioLevel * 100} className="h-2" />
          </div>
        </div>
      )}

      {/* Transcription Status */}
      {isTranscribing && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Transcribing audio...
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
            disabled={disabled || recordingState.isRecording || isTranscribing}
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
        </div>

        {/* Voice Record Button */}
        <Button
          size="lg"
          variant={recordingState.isRecording ? "destructive" : "outline"}
          disabled={disabled || isTranscribing}
          onMouseDown={handleStartRecording}
          onMouseUp={handleStopRecording}
          onMouseLeave={handleStopRecording}
          onTouchStart={handleStartRecording}
          onTouchEnd={handleStopRecording}
          className={cn(
            "h-11 w-11 p-0 transition-all duration-200",
            recordingState.isRecording && "animate-pulse scale-110"
          )}
          title="Hold to record voice message"
        >
          {recordingState.isRecording ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </Button>

        {/* Send Button */}
        <Button
          size="lg"
          onClick={handleSendText}
          disabled={
            !textMessage.trim() ||
            disabled ||
            recordingState.isRecording ||
            isTranscribing
          }
          className="h-11 w-11 p-0"
        >
          {isTranscribing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Helper Text */}
      <div className="mt-2 text-xs text-muted-foreground">
        {recordingState.isRecording
          ? "Release to stop recording"
          : "Press Enter to send • Hold mic button to record"}
      </div>
    </Card>
  );
}
