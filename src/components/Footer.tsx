import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { FormEvent } from "react";
import { Instagram, Facebook, MapPin, Mail, Phone } from "lucide-react";
import logo from "@/assets/logo-loma-light.jpg";

export function Footer() {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setSent(false);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") }),
    }).catch(() => null);

    setSending(false);

    if (!response?.ok) {
      setError("Não foi possível enviar.");
      return;
    }

    form.reset();
    setSent(true);
  }

  return (
    <footer className="border-t border-border bg-gradient-cocoa">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-20 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-5">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Loma"
              width={56}
              height={56}
              className="rounded-full object-cover ring-1 ring-primary/30"
            />
            <div>
              <div className="font-display text-2xl text-gradient-gold leading-none">LOMA</div>
              <div className="eyebrow !text-[10px] mt-1.5">{t("footer.tagline")}</div>
            </div>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            {t("home.aboutBody")}
          </p>
        </div>

        <div className="lg:col-span-2">
          <div className="eyebrow mb-5">{t("footer.explore")}</div>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/sobre" className="text-muted-foreground hover:text-primary transition">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link to="/servicos" className="text-muted-foreground hover:text-primary transition">
                {t("nav.services")}
              </Link>
            </li>
            <li>
              <Link
                to="/agendamento"
                className="text-muted-foreground hover:text-primary transition"
              >
                {t("nav.booking")}
              </Link>
            </li>
            <li>
              <Link to="/loja" className="text-muted-foreground hover:text-primary transition">
                {t("nav.shop")}
              </Link>
            </li>
            <li>
              <Link to="/galeria" className="text-muted-foreground hover:text-primary transition">
                {t("nav.gallery")}
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="eyebrow mb-5">{t("footer.contact")}</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-primary" />
              {t("contact.address")}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              +351 913 016 182
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Lomahairspa@gmail.com
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="eyebrow mb-5">{t("footer.newsletter")}</div>
          <form
            onSubmit={submitNewsletter}
            className="flex border border-border focus-within:border-primary/50 transition"
          >
            <input
              name="email"
              type="email"
              required
              placeholder={t("footer.emailPh")}
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button
              disabled={sending}
              className="px-4 bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.25em] disabled:opacity-60"
            >
              {sending ? "..." : t("footer.subscribe")}
            </button>
          </form>
          {sent && <p className="mt-3 text-xs text-primary">Email recebido.</p>}
          {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
          <div className="flex gap-3 mt-6">
            <a
              href="https://www.instagram.com/lomahairspa/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 border border-border hover:border-primary hover:text-primary transition"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://web.facebook.com/p/Loma-Clinic-Beauty-Spa-61573543078184/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 border border-border hover:border-primary hover:text-primary transition"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row gap-2 justify-between text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} LOMA Clinic & Beauty Hair. {t("footer.rights")}
          </span>
          <div className="flex items-center gap-4">
            <Link to="/privacidade" className="hover:text-primary transition-colors">
              Privacidade
            </Link>
            <Link to="/termos" className="hover:text-primary transition-colors">
              Termos
            </Link>
            <span className="tracking-[0.2em] uppercase">Made with care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
