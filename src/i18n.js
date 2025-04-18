import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)

    .use(LanguageDetector)
    .use(initReactI18next)

    .init({
        fallbackLng     :   'en',
        lng             :   "en",
        debug           :   false,
        interpolation   :   {
        escapeValue :   false,
    },
    backend: {
        loadPath: function (lng) {
            return `${import.meta.env.VITE_LOCALES_URL}/${lng}/translation_${lng}_${import.meta.env.VITE_LOCALES_VERSION}.json`
        },
        crossDomain: true
    }
});

export default i18n;