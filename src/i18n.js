import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import translationEN from './i18n/locales/en.json';
import translationFR from './i18n/locales/fr.json';
import translationNL from './i18n/locales/nl.json';

// Initialize i18next with configuration
i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      fr: { translation: translationFR },
      nl: { translation: translationNL },
    },
    lng: 'fr', // Default language
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'nl'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;