import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInterfaceProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  isDarkMode: boolean;
}

export default function VoiceInterface({ isRecording, onToggleRecording, isDarkMode }: VoiceInterfaceProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="mb-8">
          <h2 className={`text-4xl font-caveat font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Your Voice, Your AI, Your Way
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Start talking to begin your conversation
          </p>
        </div>
        
        <div className="relative">
          {/* Voice visualization rings */}
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-400 opacity-25 animate-ping"></div>
              <div className="absolute inset-4 rounded-full bg-red-400 opacity-50 animate-ping animation-delay-75"></div>
              <div className="absolute inset-8 rounded-full bg-red-400 opacity-75 animate-ping animation-delay-150"></div>
            </>
          )}
          
          <button
            onClick={onToggleRecording}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl ${
              isRecording
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
            }`}
          >
            {isRecording ? <MicOff size={40} /> : <Mic size={40} />}
          </button>
        </div>
        
        <div className="mt-6">
          <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {isRecording ? 'Listening...' : 'Click to Start Talking'}
          </p>
          {isRecording && (
            <div className="flex items-center justify-center mt-2 space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}