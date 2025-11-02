import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const resources = {
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  }
};

console.log('i18n: Starting initialization...');
console.log('i18n: Available resources:', Object.keys(resources));
console.log('i18n: English translations:', enTranslations);
console.log('i18n: Arabic translations:', arTranslations);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    debug: true, // Enable debug for troubleshooting
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferredLanguage',
    },
    
    react: {
      useSuspense: false,
    },
  })
  .then(() => {
    console.log('i18n: Initialization completed successfully');
    console.log('i18n: Current language:', i18n.language);
    console.log('i18n: Available languages:', i18n.languages);
    console.log('i18n: Available resources after init:', Object.keys(i18n.options.resources || {}));
    
    // Set initial document direction
    const initialLang = i18n.language || 'ar';
    document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = initialLang;
    
    console.log(`i18n: Document direction set to: ${document.documentElement.dir}`);
  })
  .catch((error) => {
    console.error('i18n: Initialization failed:', error);
  });

export default i18n; 