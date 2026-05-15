import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { translations } from '@/constants/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const loadLang = async () => {
      const storedLang = await SecureStore.getItemAsync('userLanguage');
      if (storedLang) {
        setLang(storedLang);
      }
    };
    loadLang();
  }, []);

  const changeLanguage = async (newLang) => {
    setLang(newLang);
    await SecureStore.setItemAsync('userLanguage', newLang);
  };

  const t = (key) => {
    const translationSet = translations[lang] || translations['en'];
    return translationSet[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
