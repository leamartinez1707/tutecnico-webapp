import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones
import translationES from '../../public/locales/es/translation.json';
import translationEN from '../../public/locales/en/translation.json';

// Recursos de traducción
const resources = {
  es: {
    translation: translationES
  },
  en: {
    translation: translationEN
  }
};

// Configuración de i18next
i18n
  // Detectar idioma del navegador
  .use(LanguageDetector)
  // Pasar la instancia de i18n a react-i18next
  .use(initReactI18next)
  // Inicializar i18next
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto
    lng: 'es', // Idioma inicial
    debug: false, // Cambiar a true para debugging
    
    interpolation: {
      escapeValue: false // React ya escapa por defecto
    },
    
    detection: {
      // Orden de detección del idioma
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // Guardar preferencia en localStorage
      lookupLocalStorage: 'i18nextLng',
    }
  });

export default i18n;
