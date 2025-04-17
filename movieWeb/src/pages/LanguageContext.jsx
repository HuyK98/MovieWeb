// LanguageContext.js
import React, { createContext, useContext, useState } from 'react';
import translations from './translations'; // đường dẫn tùy vào cấu trúc folder


const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('vi'); // 'vi' cho tiếng Việt, 'en' cho tiếng Anh

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };
  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);