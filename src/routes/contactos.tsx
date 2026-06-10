import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { MapPin, Clock, Phone, Mail, Instagram, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contactos")({
  head: () => ({
    meta: [
      { title: "Contactos — LOMA Clinic & Beauty Hair" },
      {
        name: "description",
        content:
          "Visite a LOMA em Santa Cruz, Torres Vedras — morada, horário, formulário e redes sociais.",
      },
      { property: "og:title", content: "Contactos — LOMA" },
      { property: "og:description", content: "Estamos à sua espera." },
      { property: "og:url", content: "https://lomaexperience.com/contactos" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/contactos" }],
  }),
  component: Contactos,
});

function Contactos() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading eyebrow={t("contact.eyebrow")} title={t("contact.title")} />

        <div className="mt-16 grid lg:grid-cols-2 gap-10">
          <Reveal>
            <div className="space-y-8">
              <ul className="space-y-5 text-sm">
                <li className="flex gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="eyebrow mb-1">Endereço</div>
                    <div>{t("contact.address")}</div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="eyebrow mb-1">Horário</div>
                    <div>{t("contact.hours")}</div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="eyebrow mb-1">Telefone</div>
                    <div>+351 913 016 182</div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="eyebrow mb-1">Email</div>
                    <div>Lomahairspa@gmail.com</div>
                  </div>
                </li>
              </ul>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/351913016182"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-primary/40 text-primary text-[12px] uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/lomahairspa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-primary/40 text-primary text-[12px] uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground transition"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </div>
              <div className="aspect-[4/3] overflow-hidden border border-border">
                <iframe
                  title="Mapa Loma"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-9.4250%2C39.0450%2C-9.3650%2C39.1000&layer=mapnik&marker=39.0712%2C-9.3948"
                  className="w-full h-full grayscale"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSending(true);
                setSent(false);
                setError("");

                const form = e.currentTarget;
                const formData = new FormData(form);
                const response = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    message: formData.get("message"),
                    website: formData.get("website"),
                  }),
                }).catch(() => null);

                setSending(false);

                if (!response?.ok) {
                  setError("Não foi possível enviar. Tente novamente.");
                  return;
                }

                form.reset();
                setSent(true);
              }}
              className="border border-border bg-card p-8 space-y-5"
            >
              <h3 className="font-display text-2xl mb-2">{t("contact.formTitle")}</h3>
              <label className="block">
                <span className="eyebrow">{t("booking.name")}</span>
                <input
                  name="name"
                  required
                  className="mt-2 w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-primary outline-none"
                />
              </label>
              <label className="block">
                <span className="eyebrow">{t("booking.email")}</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-primary outline-none"
                />
              </label>
              <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
              <label className="block">
                <span className="eyebrow">{t("contact.message")}</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="mt-2 w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-primary outline-none"
                />
              </label>
              <button
                disabled={sending}
                className="w-full px-6 py-4 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.28em] hover:bg-primary/90 transition disabled:opacity-60"
              >
                {sending ? "A enviar..." : t("contact.send")}
              </button>
              {sent && <p className="text-sm text-primary">{t("contact.sent")}</p>}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
