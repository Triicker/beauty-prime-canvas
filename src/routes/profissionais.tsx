import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import {
  Sparkles, CalendarCheck, Cpu, TrendingUp, Camera, Users,
  MapPin, Crown, Wine, ArrowRight, Coffee,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import heroImg from "@/assets/pros-hero.jpg";
import stationImg from "@/assets/pros-station.jpg";
import nailImg from "@/assets/pros-nail.jpg";
import estheticImg from "@/assets/pros-esthetic.jpg";
import loungeImg from "@/assets/pros-lounge.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/profissionais")({
  head: () => ({
    meta: [
      { title: "Profissionais — Aluguer de Espaços | Loma" },
      { name: "description", content: "Aluguer de cadeiras e espaços premium para cabeleireiros, nail designers e profissionais de estética na Loma." },
      { property: "og:title", content: "Profissionais — Loma" },
      { property: "og:description", content: "Espaços premium para profissionais da beleza." },
      { property: "og:image", content: "https://beauty-prime-canvas.lovable.app/og/pros.jpg" },
      { property: "og:url", content: "https://beauty-prime-canvas.lovable.app/profissionais" },
    ],
    links: [
      { rel: "canonical", href: "https://beauty-prime-canvas.lovable.app/profissionais" },
    ],
  }),
  component: ProsPage,
});

const SPACE_IMAGES = [stationImg, estheticImg, stationImg, loungeImg, stationImg, stationImg, nailImg, estheticImg];
const BENEFIT_ICONS = [Sparkles, CalendarCheck, Cpu, TrendingUp, Camera, Users, MapPin, Crown, Wine];
const BEFORE_AFTER = [
  { a: g1, b: g4 },
  { a: g2, b: g5 },
  { a: g3, b: g6 },
];

function BeforeAfter({ a, b, labels }: { a: string; b: string; labels: { a: string; b: string } }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div
      ref={ref}
      onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
      onMouseMove={(e) => dragging.current && move(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => move(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      className="relative aspect-[4/5] overflow-hidden border border-border select-none group cursor-ew-resize ring-gold-glow"
    >
      <img src={b} alt="depois" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={a} alt="antes" className="absolute inset-0 h-full object-cover" style={{ width: `${(100 / pos) * 100}%`, maxWidth: "none" }} />
      </div>
      <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] bg-background/70 backdrop-blur text-primary border border-primary/30">{labels.a}</div>
      <div className="absolute top-3 right-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] bg-background/70 backdrop-blur text-primary border border-primary/30">{labels.b}</div>
      <div className="absolute inset-y-0 w-px bg-primary/90 shadow-[0_0_20px_rgba(212,175,90,0.7)]" style={{ left: `${pos}%` }} />
      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl transition group-hover:scale-110" style={{ left: `${pos}%` }}>
        <ArrowRight className="w-4 h-4 -rotate-180" />
        <ArrowRight className="w-4 h-4 absolute" />
      </div>
    </div>
  );
}

function ProsPage() {
  const { t, i18n } = useTranslation();
  const [sent, setSent] = useState(false);
  const spaces = t("pros.spaces", { returnObjects: true }) as { n: string; d: string; b: string[] }[];
  const benefits = t("pros.benefits", { returnObjects: true }) as { t: string; d: string }[];
  const isPT = !i18n.language?.startsWith("en");

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/55 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.22_0.04_50/0.75)_100%)]" />
        <div className="relative mx-auto max-w-6xl px-6 sm:px-8 py-32 text-center">
          <Reveal>
            <div className="eyebrow mb-6">{t("pros.eyebrow")}</div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.98] tracking-tight">
              <span className="text-gradient-gold">{t("pros.hTitle")}</span>
            </h1>
            <p className="mt-8 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t("pros.hSub")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contacto" className="px-8 h-14 inline-flex items-center justify-center bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.28em] hover:bg-primary/90 transition">
                {t("pros.ctaInfo")}
              </a>
              <a href="#contacto" className="px-8 h-14 inline-flex items-center justify-center border border-primary/40 text-primary text-[12px] uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition">
                {t("pros.ctaVisit")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SPACES */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow={t("pros.spacesEyebrow")} title={t("pros.spacesTitle")} />
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {spaces.map((s, i) => (
              <Reveal key={s.n} delay={i * 60}>
                <article className="group border border-border bg-card hover-lift flex flex-col h-full">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={SPACE_IMAGES[i % SPACE_IMAGES.length]} alt={s.n} loading="lazy" className="w-full h-full object-cover transition duration-[1200ms] group-hover:scale-110" />
                  </div>
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <h3 className="font-display text-2xl leading-tight">{s.n}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                    <ul className="mt-2 space-y-1.5 text-[12px] text-foreground/80">
                      {s.b.map((bn) => (
                        <li key={bn} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary" />{bn}
                        </li>
                      ))}
                    </ul>
                    <a href="#contacto" className="mt-auto pt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-primary group-hover:gap-3 transition-all">
                      {t("pros.moreCta")} <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE & AFTER */}
      <section className="py-24 sm:py-32 bg-gradient-cocoa border-y border-border">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow={t("pros.beforeEyebrow")} title={t("pros.beforeTitle")} />
          <p className="mt-5 text-center max-w-2xl mx-auto text-muted-foreground">{t("pros.beforeSub")}</p>
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {BEFORE_AFTER.map((ba, i) => (
              <Reveal key={i} delay={i * 100}>
                <BeforeAfter a={ba.a} b={ba.b} labels={{ a: isPT ? "Antes" : "Before", b: isPT ? "Depois" : "After" }} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow={t("pros.benefitsEyebrow")} title={t("pros.benefitsTitle")} />
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {benefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[i] ?? Sparkles;
              return (
                <Reveal key={b.t} delay={i * 50}>
                  <div className="bg-background hover:bg-card transition p-8 h-full flex flex-col gap-4">
                    <div className="w-12 h-12 border border-primary/40 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-2xl leading-tight">{b.t}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="py-24 sm:py-32 bg-gradient-cocoa border-y border-border">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="relative">
              <img src={loungeImg} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover ring-gold-glow" />
              <div className="absolute -bottom-6 -right-6 hidden sm:flex w-32 h-32 rounded-full bg-primary text-primary-foreground items-center justify-center text-center text-[10px] uppercase tracking-[0.3em] shadow-2xl">
                <Coffee className="w-5 h-5 mr-1" /> Café Loma
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div>
              <div className="eyebrow mb-4">{t("pros.experienceEyebrow")}</div>
              <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] whitespace-pre-line">
                <span className="text-gradient-gold">{t("pros.experienceTitle")}</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg">{t("pros.experienceBody")}</p>
              <a href="#contacto" className="mt-10 inline-flex items-center gap-3 px-8 h-13 py-4 border border-primary/40 text-primary text-[12px] uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition">
                {t("pros.ctaVisit")} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FORM */}
      <section id="contacto" className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <SectionHeading eyebrow={t("pros.formEyebrow")} title={t("pros.formTitle")} />
          <Reveal>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="mt-14 border border-border bg-card p-8 sm:p-10 grid sm:grid-cols-2 gap-5"
            >
              <Field label={t("pros.fName")} required />
              <Field label={t("pros.fArea")} placeholder={t("pros.fAreaPh")} required />
              <Field label={t("pros.fPhone")} type="tel" required />
              <Field label={t("pros.fInsta")} placeholder="@" />
              <div className="sm:col-span-2"><Field label={t("pros.fInterest")} placeholder={t("pros.fInterestPh")} /></div>
              <label className="block sm:col-span-2">
                <span className="eyebrow">{t("pros.fMessage")}</span>
                <textarea rows={5} className="mt-2 w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-primary outline-none transition" />
              </label>
              <button className="sm:col-span-2 mt-2 w-full px-6 py-4 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.3em] hover:bg-primary/90 transition">
                {t("pros.fSubmit")}
              </button>
              {sent && <p className="sm:col-span-2 text-sm text-primary text-center">{t("pros.fSent")}</p>}
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Field({ label, type = "text", placeholder, required }: { label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}{required && " *"}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-primary outline-none transition placeholder:text-muted-foreground/50"
      />
    </label>
  );
}
