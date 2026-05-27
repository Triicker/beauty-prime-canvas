import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { pt } from "./i18n/pt";
import { en } from "./i18n/en";
import { fr } from "./i18n/fr";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

if (!i18next.isInitialized) {
  const isClient = typeof window !== "undefined";
  const instance = i18next.use(initReactI18next);
  if (isClient) instance.use(LanguageDetector);
  instance.init({
    initImmediate: false,
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      fr: { translation: fr },
    },
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

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
