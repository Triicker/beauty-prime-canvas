import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

const CONSENT_KEY = "loma_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between px-6 py-4">
        <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Utilizamos armazenamento local</span> para
          guardar as suas preferências de idioma e o carrinho de compras.{" "}
          <Link
            to="/privacidade"
            className="underline underline-offset-2 hover:text-primary transition-colors"
          >
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={reject}
            className="px-5 h-9 text-[11px] uppercase tracking-[0.2em] border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="px-5 h-9 text-[11px] uppercase tracking-[0.2em] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
