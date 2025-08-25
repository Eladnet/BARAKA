import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children, defaultTheme = 'dark', storageKey = 'nocturne-theme' }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(storageKey) || defaultTheme;
    }
    return defaultTheme;
  });

  const [customColors, setCustomColors] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nocturne-custom-colors');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Apply custom colors if available
    if (customColors) {
      Object.entries(customColors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }, [theme, customColors]);

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    customColors,
    setCustomColors: (colors) => {
      localStorage.setItem('nocturne-custom-colors', JSON.stringify(colors));
      setCustomColors(colors);
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};