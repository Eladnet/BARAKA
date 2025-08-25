import React, { createContext, useContext, useState, useEffect } from 'react';

const RTLContext = createContext();

export const useRTL = () => {
  const context = useContext(RTLContext);
  if (!context) {
    throw new Error('useRTL must be used within RTLProvider');
  }
  return context;
};

export const RTLProvider = ({ children }) => {
  const [language, setLanguage] = useState('he');
  const [direction, setDirection] = useState('rtl');

  const changeLanguage = (langCode, languageData) => {
    setLanguage(langCode);
    setDirection(languageData.dir);
    
    // Store in localStorage
    localStorage.setItem('nocturne-language', langCode);
    
    // Apply to document
    document.documentElement.setAttribute('dir', languageData.dir);
    document.documentElement.setAttribute('lang', langCode);
  };

  useEffect(() => {
    // Load saved language
    const savedLanguage = localStorage.getItem('nocturne-language') || 'he';
    const languageData = {
      he: { dir: 'rtl' },
      en: { dir: 'ltr' },
      es: { dir: 'ltr' },
      ar: { dir: 'rtl' },
      ru: { dir: 'ltr' },
      fr: { dir: 'ltr' }
    };
    
    changeLanguage(savedLanguage, languageData[savedLanguage] || { dir: 'rtl' });
  }, []);

  return (
    <RTLContext.Provider value={{
      language,
      direction,
      isRTL: direction === 'rtl',
      changeLanguage
    }}>
      {children}
    </RTLContext.Provider>
  );
};