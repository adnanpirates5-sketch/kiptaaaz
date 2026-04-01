import { useState } from 'react';

export const useLanguage = () => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  return { language, toggleLanguage };
};