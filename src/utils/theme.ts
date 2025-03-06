// Theme utility functions
export type Theme = 'light' | 'dark' | 'system';

export const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getStoredTheme = (): Theme => {
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  return storedTheme || 'system';
};

export const setTheme = (theme: Theme): void => {
  if (theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark')) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  if (theme === 'system') {
    localStorage.removeItem('theme');
  } else {
    localStorage.setItem('theme', theme);
  }
};

export const initializeTheme = (): void => {
  const storedTheme = getStoredTheme();
  setTheme(storedTheme);
};
