import { useState, useEffect } from "react";
import { useChat } from "../../hooks/useChat";
import { useAudio } from "../../hooks/useAudio";
import { useSettings } from "../../hooks/useSettings";
import SettingsPanel from "./SettingsPanel";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChatDisplay from "./ChatDisplay";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertCircle, Wifi, WifiOff, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

const Chat = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const { settings, updateSetting } = useSettings();

  // Derive dark mode from settings
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      if (settings.theme === "system") {
        const systemDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setIsDarkMode(systemDarkMode);
      } else {
        setIsDarkMode(settings.theme === "dark");
      }
    };

    updateTheme();

    // Listen for system theme changes when using system theme
    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateTheme);
      return () => mediaQuery.removeEventListener("change", updateTheme);
    }
  }, [settings.theme]);

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    updateSetting("theme", theme);
  };

  const {
    messages,
    sessions,
    currentSessionId,
    isLoading,
    error,
    isConnected,
    isTyping,
    sendMessage,
    createNewSession,
    switchSession,
    clearError,
    retryConnection,
  } = useChat();

  const { playAudio, stopAudio } = useAudio();

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handlePlayMessage = async (messageId: string) => {
    if (currentPlayingId === messageId) {
      stopAudio();
      setCurrentPlayingId(null);
    } else {
      // Find the message
      const message = messages.find((m) => m.id === messageId);
      if (message?.audioUrl) {
        try {
          await playAudio(message.audioUrl, messageId);
          setCurrentPlayingId(messageId);
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      } else {
        // For messages without audio URL, we could implement TTS here
        setCurrentPlayingId(messageId);
        // Simulate playing for demo purposes
        setTimeout(() => setCurrentPlayingId(null), 3000);
      }
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "dark bg-gray-900"
          : "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50"
      }`}
    >
      <div className="flex h-screen">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isDarkMode={isDarkMode}
        />

        <div className="flex-1 flex flex-col">
          <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

          <main className="flex-1 flex flex-col min-h-0">
            {/* Connection Status */}
            {!isConnected && (
              <Alert variant="destructive" className="m-4 mb-0">
                <WifiOff className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>
                    Connection lost. Some features may not work properly.
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={retryConnection}
                    className="ml-2"
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive" className="m-4 mb-0">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearError}
                    className="ml-2"
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {currentPage === "home" && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Main Chat Interface */}
                <div className="flex-1 min-h-0">
                  {messages.length === 0 && !isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Card className="p-8 text-center max-w-md">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-3xl">🤖</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          Welcome to GenVox AI
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Your intelligent voice assistant is ready to help.
                          Start a conversation by typing a message or using
                          voice input.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="gap-1">
                            {isConnected ? (
                              <>
                                <Wifi className="w-3 h-3" />
                                Online
                              </>
                            ) : (
                              <>
                                <WifiOff className="w-3 h-3" />
                                Offline
                              </>
                            )}
                          </Badge>
                          {isLoading && (
                            <Badge variant="secondary" className="gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Loading
                            </Badge>
                          )}
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <ChatDisplay
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      onPlayMessage={handlePlayMessage}
                      isTyping={isTyping}
                      currentPlayingId={currentPlayingId || undefined}
                      isLoading={isLoading}
                      className="h-full"
                    />
                  )}
                </div>
              </div>
            )}

            {currentPage === "conversations" && (
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h1
                      className={`text-3xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Your Conversations
                    </h1>
                    <Button onClick={() => createNewSession()}>New Chat</Button>
                  </div>

                  <div className="grid gap-4">
                    {sessions.map((session) => (
                      <Card
                        key={session.id}
                        className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 ${
                          currentSessionId === session.id
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() => {
                          switchSession(session.id);
                          setCurrentPage("home");
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold truncate">
                            {session.title}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            {new Date(session.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {session.lastMessage}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {session.messageCount} messages
                          </Badge>
                          <Badge variant="outline">{session.language}</Badge>
                        </div>
                      </Card>
                    ))}

                    {sessions.length === 0 && (
                      <Card className="p-8 text-center">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-lg font-semibold mb-2">
                          No conversations yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Start your first conversation to see it here.
                        </p>
                        <Button onClick={() => setCurrentPage("home")}>
                          Start Chatting
                        </Button>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentPage === "settings" && (
              <SettingsPanel
                isDarkMode={isDarkMode}
                onThemeChange={handleThemeChange}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Chat;
