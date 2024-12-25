import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Khởi tạo i18next
i18n
  .use(HttpBackend) // Load file JSON từ public/locales
  .use(LanguageDetector) // Phát hiện ngôn ngữ trình duyệt
  .use(initReactI18next) // Kết nối với React
  .init({
    fallbackLng: 'en', // Ngôn ngữ mặc định
    debug: true, // Bật debug trong môi trường dev
    interpolation: {
      escapeValue: false, // React đã tự xử lý escape
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Đường dẫn tới file JSON
    },
  });

export default i18n;
