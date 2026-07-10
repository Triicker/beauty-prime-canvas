import { useTranslation } from "react-i18next";

const WHATSAPP_URL = "https://wa.me/351913016182";

export function FloatingWhatsApp() {
  const { t } = useTranslation();

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("common.whatsapp")}
      title={t("common.whatsapp")}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[70] flex size-20 items-center justify-center rounded-full bg-[#e8fbe9]/90 shadow-[0_18px_42px_rgba(23,181,55,0.25)] backdrop-blur-sm transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#19b43a] sm:bottom-8 sm:right-8 sm:size-24"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-[#16b832] text-white shadow-[0_10px_24px_rgba(22,184,50,0.36)] sm:size-16">
        <svg
          aria-hidden="true"
          viewBox="0 0 32 32"
          className="size-8 sm:size-10"
          fill="currentColor"
        >
          <path d="M16 3C8.82 3 3 8.63 3 15.57c0 2.64.85 5.09 2.31 7.11L3.8 29l6.64-1.47A13.42 13.42 0 0 0 16 28.14c7.18 0 13-5.63 13-12.57S23.18 3 16 3Zm0 22.92c-1.78 0-3.49-.44-5.02-1.28l-.36-.2-3.94.87.89-3.73-.24-.38a10.13 10.13 0 0 1-1.7-5.63C5.63 9.86 10.28 5.22 16 5.22s10.37 4.64 10.37 10.35S21.72 25.92 16 25.92Zm5.88-7.72c-.32-.16-1.91-.91-2.2-1.02-.3-.1-.51-.16-.73.16-.21.31-.84 1.02-1.03 1.23-.19.21-.38.24-.7.08-.32-.16-1.36-.48-2.59-1.54a9.53 9.53 0 0 1-1.79-2.15c-.19-.31-.02-.48.14-.63.15-.14.32-.36.48-.55.16-.18.21-.31.32-.52.11-.21.05-.39-.03-.55-.08-.16-.73-1.69-1-2.31-.26-.6-.53-.52-.73-.53h-.62c-.22 0-.57.08-.86.39-.3.31-1.14 1.08-1.14 2.62 0 1.55 1.17 3.05 1.33 3.26.16.21 2.3 3.39 5.56 4.75.78.33 1.38.53 1.85.68.78.24 1.49.21 2.05.13.63-.09 1.91-.76 2.18-1.49.27-.73.27-1.36.19-1.49-.08-.13-.3-.21-.62-.37Z" />
        </svg>
      </span>
    </a>
  );
}
