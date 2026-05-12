import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Instagram, Facebook, MapPin, Mail, Phone } from "lucide-react";
import logo from "@/assets/logo-loma-light.jpg";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-gradient-cocoa">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-20 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-5">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Loma" width={56} height={56} className="rounded-full object-cover ring-1 ring-primary/30" />
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
            <li><Link to="/sobre" className="text-muted-foreground hover:text-primary transition">{t("nav.about")}</Link></li>
            <li><Link to="/servicos" className="text-muted-foreground hover:text-primary transition">{t("nav.services")}</Link></li>
            <li><Link to="/agendamento" className="text-muted-foreground hover:text-primary transition">{t("nav.booking")}</Link></li>
            <li><Link to="/loja" className="text-muted-foreground hover:text-primary transition">{t("nav.shop")}</Link></li>
            <li><Link to="/galeria" className="text-muted-foreground hover:text-primary transition">{t("nav.gallery")}</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="eyebrow mb-5">{t("footer.contact")}</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary" />{t("contact.address")}</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" />+351 210 000 000</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" />hello@loma.pt</li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="eyebrow mb-5">{t("footer.newsletter")}</div>
          <form onSubmit={(e) => e.preventDefault()} className="flex border border-border focus-within:border-primary/50 transition">
            <input
              type="email"
              required
              placeholder={t("footer.emailPh")}
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button className="px-4 bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.25em]">
              {t("footer.subscribe")}
            </button>
          </form>
          <div className="flex gap-3 mt-6">
            <a href="#" aria-label="Instagram" className="p-2 border border-border hover:border-primary hover:text-primary transition"><Instagram className="w-4 h-4" /></a>
            <a href="#" aria-label="Facebook" className="p-2 border border-border hover:border-primary hover:text-primary transition"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row gap-2 justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Loma Clinic & Beauty Spa. {t("footer.rights")}</span>
          <span className="tracking-[0.2em] uppercase">Made with care</span>
        </div>
      </div>
    </footer>
  );
}
