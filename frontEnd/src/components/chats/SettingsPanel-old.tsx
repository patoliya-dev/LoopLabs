import React, { useState } from 'react';
import { Globe, Volume2, Cpu, Download, CheckCircle, Settings, Moon, Sun, Monitor, Play, RotateCcw, Save } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface SettingsPanelProps {
  isDarkMode: boolean;
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

export default function SettingsPanel({ isDarkMode, onThemeChange }: SettingsPanelProps) {
  const { settings, updateSetting, resetSettings, isLoading } = useSettings();
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [downloadingModel, setDownloadingModel] = useState<string | null>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const voices = [
    { id: 'neural-female', name: 'Nova (Neural Female)', type: 'Neural', language: 'en' },
    { id: 'neural-male', name: 'Atlas (Neural Male)', type: 'Neural', language: 'en' },
    { id: 'classic-female', name: 'Aria (Classic Female)', type: 'Classic', language: 'en' },
    { id: 'classic-male', name: 'Phoenix (Classic Male)', type: 'Classic', language: 'en' },
    { id: 'neural-spanish-female', name: 'Elena (Neural Female)', type: 'Neural', language: 'es' },
    { id: 'neural-french-male', name: 'Pierre (Neural Male)', type: 'Neural', language: 'fr' },
  ];

  const models = [
    { id: 'llama-7b', name: 'Llama 2 7B', size: '4.1 GB', status: 'downloaded', description: 'Fast and efficient for general conversations' },
    { id: 'llama-13b', name: 'Llama 2 13B', size: '7.3 GB', status: 'available', description: 'More capable, slower processing' },
    { id: 'codellama-7b', name: 'Code Llama 7B', size: '4.1 GB', status: 'available', description: 'Specialized for coding tasks' },
    { id: 'mistral-7b', name: 'Mistral 7B', size: '4.1 GB', status: 'available', description: 'Balanced performance and capabilities' },
  ];

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const handleVoicePreview = async (voiceId: string) => {
    setPreviewingVoice(voiceId);
    try {
      // Simulate voice preview with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Playing preview for voice: ${voiceId}`);
    } catch (error) {
      console.error('Voice preview failed:', error);
    } finally {
      setPreviewingVoice(null);
    }
  };

  const handleModelDownload = async (modelId: string) => {
    setDownloadingModel(modelId);
    try {
      // Simulate model download
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log(`Downloaded model: ${modelId}`);
    } catch (error) {
      console.error('Model download failed:', error);
    } finally {
      setDownloadingModel(null);
    }
  };

  const filteredVoices = voices.filter(voice => voice.language === settings.language);

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-caveat font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Settings & Preferences
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={resetSettings}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the visual appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.value}
                      onClick={() => {
                        updateSetting('theme', theme.value);
                        onThemeChange?.(theme.value);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        settings.theme === theme.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : isDarkMode
                            ? 'border-gray-600 hover:border-gray-500'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${
                        settings.theme === theme.value
                          ? 'text-purple-600 dark:text-purple-400'
                          : isDarkMode
                            ? 'text-gray-400'
                            : 'text-gray-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        settings.theme === theme.value
                          ? 'text-purple-700 dark:text-purple-300'
                          : isDarkMode
                            ? 'text-gray-300'
                            : 'text-gray-700'
                      }`}>
                        {theme.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language & Region
              </CardTitle>
              <CardDescription>
                Choose your preferred language for voice recognition and AI responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => updateSetting('language', lang.code)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      settings.language === lang.code
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : isDarkMode
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-xl">{lang.flag}</span>
                      <span className={`text-sm font-medium ${
                        settings.language === lang.code
                          ? 'text-purple-700 dark:text-purple-300'
                          : isDarkMode
                            ? 'text-gray-300'
                            : 'text-gray-700'
                      }`}>
                        {lang.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedVoice === voice.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : isDarkMode
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${
                        selectedVoice === voice.id
                          ? 'text-green-700 dark:text-green-300'
                          : isDarkMode
                            ? 'text-gray-300'
                            : 'text-gray-700'
                      }`}>
                        {voice.name}
                      </h3>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {voice.type} Voice
                      </span>
                    </div>
                    <button className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                      Preview
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Model Settings */}
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <Cpu className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                AI Model Manager
              </h2>
            </div>
            
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Switch between different AI models for various conversation styles and capabilities
            </p>
            
            <div className="space-y-3">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    selectedModel === model.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : isDarkMode
                        ? 'border-gray-600'
                        : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedModel(model.id)}
                        className={`w-4 h-4 rounded-full border-2 transition-colors duration-200 ${
                          selectedModel === model.id
                            ? 'border-purple-500 bg-purple-500'
                            : isDarkMode
                              ? 'border-gray-500'
                              : 'border-gray-300'
                        }`}
                      >
                        {selectedModel === model.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </button>
                      <div>
                        <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {model.name}
                        </h3>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {model.size}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {model.status === 'downloaded' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {model.status === 'downloading' && (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-500">45%</span>
                        </div>
                      )}
                      {model.status === 'available' && (
                        <button className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                          isDarkMode
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}>
                          <Download size={14} />
                          <span>Download</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}