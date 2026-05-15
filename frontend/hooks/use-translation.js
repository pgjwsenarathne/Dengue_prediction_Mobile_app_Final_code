import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { translations } from '@/constants/translations';

export const useTranslation = () => {
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

  return { t, lang, changeLanguage };
};
