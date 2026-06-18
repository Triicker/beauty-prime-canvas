import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { pt } from "./pt";
import { en } from "./en";
import { fr } from "./fr";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next);

  i18n.init({
    initImmediate: false,
    resources: { pt: { translation: pt }, en: { translation: en }, fr: { translation: fr } },
    fallbackLng: "pt",
    lng: "pt",
    supportedLngs: ["pt", "en", "fr"],
    interpolation: { escapeValue: false },
  });
}

export default i18n;
