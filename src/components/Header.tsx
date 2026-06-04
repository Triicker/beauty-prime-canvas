import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingBag, Sun, Moon, ChevronDown } from "lucide-react";
import logoAsset from "@/assets/loma-logo.png.asset.json";
import { useCart } from "@/store/cart";

const LANGS = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

export function Header() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("theme-dark") ? "dark" : "light";
    }
    return "dark";
  });
  const langRef = useRef<HTMLDivElement>(null);
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
    setLangOpen(false);
  }, [pathname]);

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("theme-dark", next === "dark");
    try {
      localStorage.setItem("loma-theme", next);
    } catch {
      // ignore
    }
  };

  const setLang = (code: string) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const currentLang = i18n.language?.slice(0, 2) ?? "pt";

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

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-20 flex items-center justify-between">
        <Link to="/" aria-label="LOMA — Página inicial" className="flex items-center">
          <img
            src={logoAsset.url}
            alt="LOMA Clinic & Beauty Spa"
            className="h-12 sm:h-14 w-auto object-contain"
          />
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

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language dropdown */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition px-2 py-2"
              aria-label="Select language"
              aria-expanded={langOpen}
            >
              {currentLang.toUpperCase()}
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
              />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-background border border-border shadow-2xl z-50 w-36 py-1">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                      currentLang === l.code
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:text-primary hover:bg-secondary"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-primary transition"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart */}
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
