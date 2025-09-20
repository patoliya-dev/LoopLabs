import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex gap-3 max-w-[85%]", className)}>
      {/* AI Avatar */}
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
          AI
        </AvatarFallback>
      </Avatar>

      {/* Typing Animation */}
      <Card className="px-4 py-3 bg-background border-border">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground mr-2">
            AI is typing
          </span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
          </div>
        </div>
      </Card>
    </div>
  );
}
