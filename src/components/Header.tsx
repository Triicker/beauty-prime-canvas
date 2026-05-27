import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import logo from "@/assets/logo-loma.jpg";
import { useCart } from "@/store/cart";

export function Header() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useRouterState({ select: (s) => s.location });
  const cartCount = useCart((s) => s.count());
  const setCartOpen = useCart((s) => s.setOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/sobre", label: t("nav.about") },
    { to: "/servicos", label: t("nav.services") },
    { to: "/profissionais", label: t("nav.pros") },
    { to: "/galeria", label: t("nav.gallery") },
    { to: "/loja", label: t("nav.shop") },
    { to: "/faq", label: t("nav.faq") },
    { to: "/contactos", label: t("nav.contact") },
  ];

  const switchLang = () => {
    const cur = i18n.language?.slice(0, 2) ?? "pt";
    const cycle: Record<string, string> = { pt: "en", en: "fr", fr: "pt" };
    i18n.changeLanguage(cycle[cur] ?? "pt");
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Loma"
            width={44}
            height={44}
            className="rounded-full ring-1 ring-primary/30 object-cover"
          />
          <span className="hidden sm:block font-display text-xl tracking-wide text-gradient-gold">
            LOMA
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="text-[13px] uppercase tracking-[0.22em] text-muted-foreground hover:text-primary transition-colors data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={switchLang}
            className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition px-2"
            aria-label="Switch language"
          >
            {(i18n.language?.slice(0, 2) ?? "pt").toUpperCase()}
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 text-muted-foreground hover:text-primary transition"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <Link
            to="/agendamento"
            className="hidden sm:inline-flex items-center px-5 h-10 text-[12px] uppercase tracking-[0.25em] border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            {t("nav.bookCta")}
          </Link>
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col px-6 py-6 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="py-3 text-sm uppercase tracking-[0.22em] text-muted-foreground hover:text-primary border-b border-border/40"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/agendamento"
              className="mt-4 inline-flex items-center justify-center px-5 h-11 text-[12px] uppercase tracking-[0.25em] bg-primary text-primary-foreground"
            >
              {t("nav.bookCta")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
