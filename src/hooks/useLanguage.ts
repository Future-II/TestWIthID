import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'ar');

  const changeLanguage = (newLang: string) => {
    console.log(`useLanguage: Changing language from ${currentLang} to ${newLang}`);
    
    try {
      i18n.changeLanguage(newLang);
      setCurrentLang(newLang);
      
      // Update document direction and language
      const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = newDir;
      document.documentElement.lang = newLang;
      
      console.log(`useLanguage: Document direction set to: ${newDir}`);
      
      // Store preference in localStorage
      localStorage.setItem('preferredLanguage', newLang);
    } catch (error) {
      console.error('useLanguage: Error changing language:', error);
    }
  };

  const toggleLanguage = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    console.log(`useLanguage: Toggling language to: ${newLang}`);
    changeLanguage(newLang);
  };

  useEffect(() => {
    console.log(`useLanguage: Initial setup - Language: ${currentLang}`);
    // Set initial direction based on current language
    const currentDir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = currentDir;
    document.documentElement.lang = currentLang;
    console.log(`useLanguage: Initial direction set to: ${currentDir}`);
  }, [currentLang]);

  useEffect(() => {
    // Check for stored language preference
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && storedLang !== currentLang) {
      console.log(`useLanguage: Found stored language preference: ${storedLang}`);
      changeLanguage(storedLang);
    }
  }, []);

  // Update currentLang when i18n language changes
  useEffect(() => {
    if (i18n.language && i18n.language !== currentLang) {
      console.log(`useLanguage: i18n language changed to: ${i18n.language}`);
      setCurrentLang(i18n.language);
    }
  }, [i18n.language, currentLang]);

  // Ensure we always have a valid language
  const finalLang = currentLang || 'ar';
  const isRTL = finalLang === 'ar';
  const isLTR = finalLang === 'en';

  console.log(`useLanguage: Current state - Language: ${finalLang}, isRTL: ${isRTL}, isLTR: ${isLTR}`);

  return {
    language: finalLang,
    changeLanguage,
    toggleLanguage,
    isRTL,
    isLTR
  };
}; 