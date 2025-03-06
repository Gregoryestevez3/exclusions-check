import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Theme, getStoredTheme, setTheme } from '../utils/theme';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('system');
  
  useEffect(() => {
    // Initialize with stored theme preference
    setCurrentTheme(getStoredTheme());
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (getStoredTheme() === 'system') {
        setTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const handleThemeChange = (newTheme: Theme) => {
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };
  
  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'light': return <Sun className="h-5 w-5" />;
      case 'dark': return <Moon className="h-5 w-5" />;
      case 'system': return <Monitor className="h-5 w-5" />;
    }
  };
  
  return (
    <div className={`flex items-center rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {(['light', 'dark', 'system'] as Theme[]).map((theme) => (
        <button
          key={theme}
          onClick={() => handleThemeChange(theme)}
          className={`p-2 flex items-center justify-center transition-colors ${
            currentTheme === theme
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          } ${theme === 'light' ? 'rounded-l-md' : ''} ${theme === 'system' ? 'rounded-r-md' : ''}`}
          title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} mode`}
          aria-label={`Switch to ${theme} mode`}
        >
          {getThemeIcon(theme)}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
