import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  loadingText = "Loading...",
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="lg" />
            <p className="text-sm font-medium text-muted-foreground">
              {loadingText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface LoadingPageProps {
  loadingText?: string;
  className?: string;
}

export function LoadingPage({
  loadingText = "Loading application...",
  className,
}: LoadingPageProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-background",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <LoadingSpinner size="lg" className="text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">GenVox AI</h3>
          <p className="text-sm text-muted-foreground">{loadingText}</p>
        </div>
      </div>
    </div>
  );
}
