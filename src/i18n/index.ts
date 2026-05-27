import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { pt } from "./pt";
import { en } from "./en";
import { fr } from "./fr";

if (!i18n.isInitialized) {
  const isClient = typeof window !== "undefined";

  i18n.use(initReactI18next);
  if (isClient) {
    i18n.use(LanguageDetector);
  }

  i18n.init({
    initImmediate: false, // Synchronous init — required for SSR
    resources: { pt: { translation: pt }, en: { translation: en }, fr: { translation: fr } },
    fallbackLng: "pt",
    lng: isClient ? undefined : "pt",
    supportedLngs: ["pt", "en", "fr"],
    interpolation: { escapeValue: false },
    ...(isClient && {
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "loma_lang",
      },
    }),
  });
}

export default i18n;
