import React, { createContext, useContext } from 'react';
import { translations } from '../translations';

const TranslationContext = createContext();

export const TranslationProvider = ({ language, children }) => {
  const t = (key) => translations[language][key] || key;

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};