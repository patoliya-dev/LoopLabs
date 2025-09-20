import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export interface AppSettings {
  language: string;
  voice: string;
  model: string;
  theme: "light" | "dark" | "system";
  autoPlayAudio: boolean;
  microphoneEnabled: boolean;
  voiceActivation: boolean;
  voiceActivationThreshold: number;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const defaultSettings: AppSettings = {
  language: "en",
  voice: "neural-female",
  model: "llama-7b",
  theme: "system",
  autoPlayAudio: true,
  microphoneEnabled: true,
  voiceActivation: false,
  voiceActivationThreshold: 0.5,
};

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("app-settings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("app-settings", JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings:", error);
      }
    }
  }, [settings, isLoading]);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("app-settings");
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSetting, resetSettings, isLoading }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
