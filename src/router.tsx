import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { pt } from "./i18n/pt";
import { en } from "./i18n/en";
import { fr } from "./i18n/fr";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    initImmediate: false,
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: "pt",
    lng: "pt",
    supportedLngs: ["pt", "en", "fr"],
    interpolation: { escapeValue: false },
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
