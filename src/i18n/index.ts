import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { pt } from "./pt";
import { en } from "./en";
import { fr } from "./fr";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: { pt: { translation: pt }, en: { translation: en }, fr: { translation: fr } },
      fallbackLng: "pt",
      supportedLngs: ["pt", "en", "fr"],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "loma_lang",
      },
    });
}

export default i18n;
