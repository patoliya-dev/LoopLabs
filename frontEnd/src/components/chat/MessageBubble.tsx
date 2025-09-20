import { Volume2, Play, Pause } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";
import type { Message } from "../../types/chat";
import { EmotionIndicator } from "./EmotionIndicator";

interface MessageBubbleProps {
  message: Message;
  onPlayAudio?: (messageId: string) => void;
  isCurrentlyPlaying?: boolean;
  className?: string;
}

export function MessageBubble({
  message,
  onPlayAudio,
  isCurrentlyPlaying = false,
  className,
}: MessageBubbleProps) {
  const isUser = message.type === "user";
  const isAI = message.type === "ai";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
        className
      )}
    >
      {/* Avatar */}
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarImage src={isUser ? undefined : "/ai-avatar.png"} />
        <AvatarFallback
          className={cn(
            "text-xs font-medium",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {isUser ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <Card
        className={cn(
          "px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md",
          isUser
            ? "bg-primary text-primary-foreground border-primary/20"
            : "bg-background border-border"
        )}
      >
        {/* Message Text */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Message Footer */}
        <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-current/10">
          {/* Timestamp */}
          <span
            className={cn(
              "text-xs opacity-70",
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Emotion Indicator */}
            {isAI && message.emotion && (
              <EmotionIndicator
                emotion={message.emotion}
                variant="compact"
                className="opacity-80"
              />
            )}

            {/* Audio Playback */}
            {isAI && message.audioUrl && onPlayAudio && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onPlayAudio(message.id)}
                className={cn(
                  "h-7 w-7 p-0 hover:scale-105 transition-transform",
                  isCurrentlyPlaying && "text-green-500 hover:text-green-600"
                )}
              >
                {isCurrentlyPlaying ? <Pause size={14} /> : <Play size={14} />}
              </Button>
            )}

            {/* Voice Playback (TTS) */}
            {isAI && !message.audioUrl && onPlayAudio && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onPlayAudio(message.id)}
                className={cn(
                  "h-7 w-7 p-0 hover:scale-105 transition-transform",
                  isCurrentlyPlaying && "text-blue-500 hover:text-blue-600"
                )}
              >
                <Volume2 size={14} />
              </Button>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        {isUser && (
          <div className="flex justify-end mt-1">
            <Badge
              variant="outline"
              className="h-5 px-2 text-xs border-current/20"
            >
              Sent
            </Badge>
          </div>
        )}
      </Card>
    </div>
  );
}
