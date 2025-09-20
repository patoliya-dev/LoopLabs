import {
  Smile,
  Heart,
  ThumbsUp,
  Meh,
  Frown,
  Star,
  Zap,
  Coffee,
} from "lucide-react";
import { cn } from "../../lib/utils";

const emotionIcons = {
  smile: Smile,
  happy: Smile,
  heart: Heart,
  love: Heart,
  "thumbs-up": ThumbsUp,
  like: ThumbsUp,
  approval: ThumbsUp,
  meh: Meh,
  neutral: Meh,
  sad: Frown,
  disappointed: Frown,
  excited: Star,
  enthusiasm: Zap,
  energy: Zap,
  casual: Coffee,
  relaxed: Coffee,
} as const;

const emotionColors = {
  smile: "text-yellow-500",
  happy: "text-yellow-500",
  heart: "text-red-500",
  love: "text-red-500",
  "thumbs-up": "text-green-500",
  like: "text-green-500",
  approval: "text-green-500",
  meh: "text-gray-500",
  neutral: "text-gray-500",
  sad: "text-blue-500",
  disappointed: "text-blue-500",
  excited: "text-purple-500",
  enthusiasm: "text-orange-500",
  energy: "text-orange-500",
  casual: "text-brown-500",
  relaxed: "text-brown-500",
} as const;

export interface EmotionIndicatorProps {
  emotion: string;
  variant?: "default" | "compact" | "large";
  showLabel?: boolean;
  className?: string;
}

export function EmotionIndicator({
  emotion,
  variant = "default",
  showLabel = false,
  className,
}: EmotionIndicatorProps) {
  const IconComponent =
    emotionIcons[emotion as keyof typeof emotionIcons] || Smile;
  const colorClass =
    emotionColors[emotion as keyof typeof emotionColors] || "text-gray-500";

  const sizeClasses = {
    compact: "w-3 h-3",
    default: "w-4 h-4",
    large: "w-5 h-5",
  };

  const containerClasses = {
    compact: "p-1",
    default: "p-1.5",
    large: "p-2",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 transition-colors",
        containerClasses[variant],
        className
      )}
    >
      <IconComponent
        className={cn(colorClass, sizeClasses[variant], "drop-shadow-sm")}
      />
      {showLabel && (
        <span
          className={cn(
            "text-xs font-medium capitalize text-foreground/80",
            variant === "compact" && "text-[10px]"
          )}
        >
          {emotion.replace("-", " ")}
        </span>
      )}
    </div>
  );
}
