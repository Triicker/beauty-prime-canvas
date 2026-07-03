import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  Sun,
  Moon,
  ChevronDown,
  CalendarDays,
  Phone,
  Instagram,
} from "lucide-react";
import logoAsset from "@/assets/logo-lomaa2.png";
import { useCart } from "@/store/cart";

const LANGS = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];
const LANG_CODES = LANGS.map((lang) => lang.code);

export function Header() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
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
    setHydrated(true);
    try {
      setTheme("light");
      document.documentElement.classList.remove("theme-dark");
      localStorage.setItem("loma-theme", "light");

      const storedLang = localStorage.getItem("loma_lang");
      if (storedLang && LANG_CODES.includes(storedLang)) {
        i18n.changeLanguage(storedLang);
      }
    } catch {
      document.documentElement.classList.remove("theme-dark");
    }
  }, [i18n]);

  useEffect(() => {
    setOpen(false);
    setLangOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
    try {
      localStorage.setItem("loma_lang", code);
    } catch {
      // ignore
    }
    setLangOpen(false);
  };

  const langPrefix = i18n.language?.slice(0, 2) ?? "pt";
  const currentLang = LANG_CODES.includes(langPrefix) ? langPrefix : "pt";

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
      className={`site-header fixed top-0 inset-x-0 z-50 ${
        theme === "light" ? "site-header-light" : "site-header-dark"
      } ${scrolled || open ? "is-solid" : "is-floating"}`}
    >
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12 h-24 flex items-center justify-between gap-8">
        <Link to="/" aria-label="LOMA — Página inicial" className="flex items-center">
          <img
            src={logoAsset}
            alt="LOMA Clinic & Beauty Spa"
            className="site-header-logo h-11 sm:h-14 lg:h-18 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 xl:gap-11">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="relative text-[12px] uppercase tracking-[0.12em] text-foreground/86 hover:text-primary transition-colors data-[status=active]:text-primary after:absolute after:left-0 after:-bottom-3 after:h-px after:w-0 after:bg-primary after:transition-all data-[status=active]:after:w-full"
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
            className="site-header-theme-toggle inline-flex p-2 text-muted-foreground hover:text-primary transition"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative hidden sm:inline-flex p-2 text-muted-foreground hover:text-primary transition"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {hydrated && cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <a
            href="tel:+351913016182"
            className="site-header-mobile-icon sm:hidden"
            aria-label="Telefonar para LOMA"
          >
            <Phone className="w-5 h-5" strokeWidth={1.8} />
          </a>

          <a
            href="https://www.instagram.com/lomahairspa/"
            target="_blank"
            rel="noreferrer"
            className="site-header-mobile-icon sm:hidden"
            aria-label="Instagram da LOMA"
          >
            <Instagram className="w-5 h-5" strokeWidth={1.8} />
          </a>

          <Link
            to="/agendamento"
            className="hidden sm:inline-flex items-center gap-3 px-6 h-12 rounded-full text-[12px] uppercase tracking-[0.12em] border border-foreground/70 text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            {t("nav.bookCta")}
            <CalendarDays className="w-4 h-4" />
          </Link>
          <button
            className="site-header-mobile-menu-button lg:hidden p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="site-header-mobile-panel lg:hidden border-t" role="dialog" aria-label="Menu principal">
          <nav className="site-header-mobile-nav flex flex-col px-6 py-6 gap-1">
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
              className="site-header-mobile-cta mt-4 inline-flex items-center justify-center px-5 h-11 text-[12px] uppercase tracking-[0.25em] bg-primary text-primary-foreground"
            >
              {t("nav.bookCta")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
