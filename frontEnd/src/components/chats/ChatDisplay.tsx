import { MessageList } from "../chat/MessageList";
import { VoiceInput } from "../chat/VoiceInput";
import type { Message } from "../../types/chat";

interface ChatDisplayProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onPlayMessage: (messageId: string) => void;
  isTyping?: boolean;
  currentPlayingId?: string;
  isLoading?: boolean;
  className?: string;
}

export default function ChatDisplay({
  messages,
  onSendMessage,
  onPlayMessage,
  isTyping = false,
  currentPlayingId,
  isLoading = false,
  className,
}: ChatDisplayProps) {
  return (
    <div className={`flex flex-col h-full ${className || ""}`}>
      {/* Messages Area */}
      <div className="flex-1 min-h-0">
        <MessageList
          messages={messages}
          isTyping={isTyping}
          currentPlayingId={currentPlayingId}
          onPlayMessage={onPlayMessage}
        />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <VoiceInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
          placeholder={
            isTyping ? "AI is typing..." : "Type a message or hold to record..."
          }
        />
      </div>
    </div>
  );
}
