import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { cn } from "../../lib/utils";
import type { Message } from "../../types/chat";

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
  currentPlayingId?: string;
  onPlayMessage?: (messageId: string) => void;
  className?: string;
  autoScroll?: boolean;
}

export function MessageList({
  messages,
  isTyping = false,
  currentPlayingId,
  onPlayMessage,
  className,
  autoScroll = true,
}: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isTyping, autoScroll]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = message.timestamp.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  const formatDateGroup = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  if (messages.length === 0 && !isTyping) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full text-center p-8",
          className
        )}
      >
        <div className="max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Start a conversation
          </h3>
          <p className="text-muted-foreground text-sm">
            Begin by typing a message or using voice input to chat with your AI
            assistant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollAreaRef} className={cn("h-full", className)}>
      <div className="p-4 space-y-6">
        {Object.entries(groupedMessages).map(([dateString, dateMessages]) => (
          <div key={dateString} className="space-y-4">
            {/* Date Separator */}
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <div className="px-3 py-1 bg-muted rounded-full">
                <span className="text-xs font-medium text-muted-foreground">
                  {formatDateGroup(dateString)}
                </span>
              </div>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-4">
              {dateMessages.map((message, index) => {
                const nextMessage = dateMessages[index + 1];
                const showAvatar =
                  !nextMessage || nextMessage.type !== message.type;

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onPlayAudio={onPlayMessage}
                    isCurrentlyPlaying={currentPlayingId === message.id}
                    className={cn(
                      !showAvatar && message.type === "user" && "mr-11",
                      !showAvatar && message.type === "ai" && "ml-11"
                    )}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 max-w-[85%]">
            <TypingIndicator />
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
