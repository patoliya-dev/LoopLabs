import React from 'react';
import { Home, MessageCircle, Settings, Zap } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isDarkMode: boolean;
}

export default function Sidebar({ currentPage, setCurrentPage, isDarkMode }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'conversations', label: 'Conversations', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`w-64 border-r ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-6`}>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className={`mt-8 p-4 rounded-2xl ${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-100 to-blue-100'}`}>
        <div className="flex items-center space-x-2 mb-2">
          <Zap className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-purple-600'}`} />
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Pro Tip
          </span>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Try saying "Hey GenVox" to wake me up, or just click the mic button to start chatting!
        </p>
      </div>
    </aside>
  );
}