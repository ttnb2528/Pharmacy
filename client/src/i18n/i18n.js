import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import các file ngôn ngữ
import viTranslation from './locales/vi/translation.json';
import enTranslation from './locales/en/translation.json';

const resources = {
  vi: {
    translation: viTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  // Phát hiện ngôn ngữ trình duyệt
  .use(LanguageDetector)
  // Tích hợp với React
  .use(initReactI18next)
  // Khởi tạo i18next
  .init({
    resources,
    fallbackLng: 'vi', // Ngôn ngữ mặc định khi không phát hiện được
    debug: false, // Đặt thành true để hiển thị logs khi phát triển
    interpolation: {
      escapeValue: false, // React đã tự động escape values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;