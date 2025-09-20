import { Sun, Moon } from 'lucide-react';
interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export default function Header({ isDarkMode, setIsDarkMode }: HeaderProps) {
  return (
    <header className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white/80 backdrop-blur-sm'} p-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <div>
            <h1 className={`text-2xl font-caveat font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              GenVox
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-caveat`}>
              The voice of the new generation
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className={`px-3 py-1 rounded-full text-sm ${
            isDarkMode 
              ? 'bg-green-900 text-green-300' 
              : 'bg-green-100 text-green-800'
          }`}>
            ● Offline & Ready
          </div>
        </div>
      </div>
    </header>
  );
}