import { useState, useEffect } from 'react';
import { translations } from '../lib/translations';

export function useTranslation(language = 'he') {
  const [currentLanguage, setCurrentLanguage] = useState(language);

  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  return { t, currentLanguage };
}