import React, { useState } from 'react';
import { Globe, Volume2, Cpu, Download, CheckCircle, Settings } from 'lucide-react';

interface SettingsPanelProps {
  isDarkMode: boolean;
}

export default function SettingsPanel({ isDarkMode }: SettingsPanelProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedVoice, setSelectedVoice] = useState('neural-female');
  const [selectedModel, setSelectedModel] = useState('llama-7b');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  const voices = [
    { id: 'neural-female', name: 'Nova (Neural Female)', type: 'Neural' },
    { id: 'neural-male', name: 'Atlas (Neural Male)', type: 'Neural' },
    { id: 'classic-female', name: 'Aria (Classic Female)', type: 'Classic' },
    { id: 'classic-male', name: 'Phoenix (Classic Male)', type: 'Classic' },
  ];

  const models = [
    { id: 'llama-7b', name: 'Llama 2 7B', size: '4.1 GB', status: 'downloaded' },
    { id: 'llama-13b', name: 'Llama 2 13B', size: '7.3 GB', status: 'available' },
    { id: 'codellama-7b', name: 'Code Llama 7B', size: '4.1 GB', status: 'available' },
    { id: 'mistral-7b', name: 'Mistral 7B', size: '4.1 GB', status: 'downloading' },
  ];

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-caveat font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Settings & Preferences
        </h1>
        
        <div className="grid gap-8">
          {/* Language Settings */}
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <Globe className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Language & Region
              </h2>
            </div>
            
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose your preferred language for voice recognition and AI responses
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedLanguage === lang.code
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : isDarkMode
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{lang.flag}</span>
                    <span className={`font-medium ${
                      selectedLanguage === lang.code
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
          </div>

          {/* Voice Settings */}
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <Volume2 className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Voice Options
              </h2>
            </div>
            
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Pick your vibe - choose how GenVox sounds when speaking to you
            </p>
            
            <div className="space-y-3">
              {voices.map((voice) => (
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