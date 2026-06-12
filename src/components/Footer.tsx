import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Facebook,
  Heart,
  HeartHandshake,
  Instagram,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import logo from "@/assets/logo-lomaa2.png";

type FooterBenefit = {
  title: string;
  body: string;
};

const benefitIcons = [Sparkles, HeartHandshake, ShieldCheck, CalendarDays];

export function Footer() {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const rawBenefits = t("footer.benefits", { returnObjects: true });
  const benefits = Array.isArray(rawBenefits) ? (rawBenefits as FooterBenefit[]) : [];

  const exploreLinks = [
    { to: "/sobre", label: t("nav.about") },
    { to: "/servicos", label: t("nav.services") },
    { to: "/agendamento", label: t("nav.booking") },
    { to: "/loja", label: t("nav.shop") },
    { to: "/galeria", label: t("nav.gallery") },
    { to: "/faq", label: t("nav.faq") },
  ];

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
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <Link to="/" className="site-footer-logo-link" aria-label="LOMA - Página inicial">
              <img src={logo} alt="LOMA Clinic & Beauty Hair" className="site-footer-logo" />
            </Link>
            <p className="site-footer-copy">{t("home.aboutBody")}</p>
            <div className="site-footer-socials" aria-label={t("footer.follow")}>
              <a
                href="https://www.instagram.com/lomahairspa/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="site-footer-social"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://web.facebook.com/p/Loma-Clinic-Beauty-Spa-61573543078184/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="site-footer-social"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav className="site-footer-column" aria-label={t("footer.explore")}>
            <h2 className="site-footer-heading">{t("footer.explore")}</h2>
            <ul className="site-footer-links">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="site-footer-link">
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer-column">
            <h2 className="site-footer-heading">{t("footer.contact")}</h2>
            <ul className="site-footer-contact">
              <li>
                <MapPin className="h-4 w-4" />
                <span>{t("contact.address")}</span>
              </li>
              <li>
                <Phone className="h-4 w-4" />
                <a href="tel:+351913016182">+351 913 016 182</a>
              </li>
              <li>
                <Mail className="h-4 w-4" />
                <a href="mailto:Lomahairspa@gmail.com">Lomahairspa@gmail.com</a>
              </li>
              <li>
                <Clock className="h-4 w-4" />
                <span>{t("contact.hours")}</span>
              </li>
            </ul>
          </div>

          <div className="site-footer-column site-footer-newsletter">
            <h2 className="site-footer-heading">{t("footer.newsletter")}</h2>
            <form onSubmit={submitNewsletter} className="site-footer-form">
              <input name="email" type="email" required placeholder={t("footer.emailPh")} />
              <button disabled={sending}>{sending ? "..." : t("footer.subscribe")}</button>
            </form>
            {sent && <p className="site-footer-message is-success">Email recebido.</p>}
            {error && <p className="site-footer-message is-error">{error}</p>}
            <p className="site-footer-spam-note">
              <LockKeyhole className="h-4 w-4" />
              <span>{t("footer.spam")}</span>
            </p>
          </div>
        </div>

        <div className="site-footer-benefits">
          {benefits.map((benefit, index) => {
            const Icon = benefitIcons[index] ?? Sparkles;
            return (
              <div className="site-footer-benefit" key={benefit.title}>
                <span className="site-footer-benefit-icon">
                  <Icon className="h-6 w-6" />
                </span>
                <span>
                  <strong>{benefit.title}</strong>
                  <small>{benefit.body}</small>
                </span>
              </div>
            );
          })}
        </div>

        <div className="site-footer-bottom">
          <span>
            © {new Date().getFullYear()} LOMA Clinic & Beauty Hair. {t("footer.rights")}
          </span>
          <div className="site-footer-bottom-links">
            <Link to="/privacidade">Privacidade</Link>
            <Link to="/termos">Termos</Link>
          </div>
          <span className="site-footer-care">
            {t("footer.madeWithCare")}
            <Heart className="h-4 w-4" />
          </span>
        </div>
      </div>
    </footer>
  );
}
