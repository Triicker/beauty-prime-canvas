import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { MapPin, Clock, Phone, Mail, Instagram, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contactos")({
  head: () => ({
    meta: [
      { title: "Contactos — Loma Clinic & Beauty Spa" },
      { name: "description", content: "Visite a Loma — morada, horário, formulário e redes sociais." },
      { property: "og:title", content: "Contactos — Loma" },
      { property: "og:description", content: "Estamos à sua espera." },
    ],
  }),
  component: Contactos,
});

function Contactos() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading eyebrow={t("contact.eyebrow")} title={t("contact.title")} />

        <div className="mt-16 grid lg:grid-cols-2 gap-10">
          <Reveal>
            <div className="space-y-8">
              <ul className="space-y-5 text-sm">
                <li className="flex gap-4"><MapPin className="w-5 h-5 text-primary mt-0.5" /><div><div className="eyebrow mb-1">Endereço</div><div>{t("contact.address")}</div></div></li>
                <li className="flex gap-4"><Clock className="w-5 h-5 text-primary mt-0.5" /><div><div className="eyebrow mb-1">Horário</div><div>{t("contact.hours")}</div></div></li>
                <li className="flex gap-4"><Phone className="w-5 h-5 text-primary mt-0.5" /><div><div className="eyebrow mb-1">Telefone</div><div>+351 210 000 000</div></div></li>
                <li className="flex gap-4"><Mail className="w-5 h-5 text-primary mt-0.5" /><div><div className="eyebrow mb-1">Email</div><div>hello@loma.pt</div></div></li>
              </ul>
              <div className="flex gap-3">
                <a href="https://wa.me/351210000000" className="inline-flex items-center gap-2 px-5 py-3 border border-primary/40 text-primary text-[12px] uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground transition"><MessageCircle className="w-4 h-4" />WhatsApp</a>
                <a href="https://instagram.com" className="inline-flex items-center gap-2 px-5 py-3 border border-primary/40 text-primary text-[12px] uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground transition"><Instagram className="w-4 h-4" />Instagram</a>
              </div>
              <div className="aspect-[4/3] overflow-hidden border border-border">
                <iframe
                  title="Mapa Loma"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-9.146,38.717,-9.140,38.722&layer=mapnik"
                  className="w-full h-full grayscale"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="border border-border bg-card p-8 space-y-5"
            >
              <h3 className="font-display text-2xl mb-2">{t("contact.formTitle")}</h3>
              <label className="block">
                <span className="eyebrow">{t("booking.name")}</span>
                <input required className="mt-2 w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-primary outline-none" />
              </label>
              <label className="block">
                <span className="eyebrow">{t("booking.email")}</span>
                <input type="email" required className="mt-2 w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-primary outline-none" />
              </label>
              <label className="block">
                <span className="eyebrow">{t("contact.message")}</span>
                <textarea required rows={5} className="mt-2 w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-primary outline-none" />
              </label>
              <button className="w-full px-6 py-4 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.28em] hover:bg-primary/90 transition">
                {t("contact.send")}
              </button>
              {sent && <p className="text-sm text-primary">{t("contact.sent")}</p>}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
