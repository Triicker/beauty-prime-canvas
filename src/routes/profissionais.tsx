import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  CalendarCheck,
  Cpu,
  TrendingUp,
  Camera,
  Users,
  MapPin,
  Crown,
  Wine,
  ArrowRight,
  Coffee,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import heroImg from "@/assets/pros-hero.jpg";
import stationImg from "@/assets/pros-station.jpg";
import nailImg from "@/assets/pros-nail.jpg";
import estheticImg from "@/assets/pros-esthetic.jpg";
import loungeImg from "@/assets/pros-lounge.png";
import type { ProfessionalSpaceRecord } from "@/lib/admin/professionals.server";

export const Route = createFileRoute("/profissionais")({
  head: () => ({
    meta: [
      { title: "Profissionais — LOMA Clinic & Beauty Hair" },
      {
        name: "description",
        content:
          "Aluguer de cadeiras e espaços premium para cabeleireiros, nail designers e profissionais de estética na Loma.",
      },
      { property: "og:title", content: "Profissionais — Loma" },
      { property: "og:description", content: "Espaços premium para profissionais da beleza." },
      { property: "og:image", content: heroImg },
      { property: "og:url", content: "https://lomaexperience.com/profissionais" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/profissionais" }],
  }),
  component: ProsPage,
});

const SPACE_IMAGES = [
  stationImg,
  estheticImg,
  stationImg,
  loungeImg,
  stationImg,
  stationImg,
  nailImg,
  estheticImg,
];
const BENEFIT_ICONS = [
  Sparkles,
  CalendarCheck,
  Cpu,
  TrendingUp,
  Camera,
  Users,
  MapPin,
  Crown,
  Wine,
];
function ProsPage() {
  const { t, i18n } = useTranslation();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const fallbackSpaces = t("pros.spaces", { returnObjects: true }) as {
    n: string;
    d: string;
    b: string[];
  }[];
  const [dbSpaces, setDbSpaces] = useState<ProfessionalSpaceRecord[]>([]);
  const benefits = t("pros.benefits", { returnObjects: true }) as { t: string; d: string }[];
  const isPT = !i18n.language?.startsWith("en");
  const lang = (i18n.language?.slice(0, 2) ?? "pt") as "pt" | "en" | "fr";

  useEffect(() => {
    let active = true;

    fetch("/api/professional-spaces")
      .then(async (response) => {
        if (!response.ok) throw new Error("Falha ao carregar espaços");
        return (await response.json()) as { spaces: ProfessionalSpaceRecord[] };
      })
      .then((data) => {
        if (active) setDbSpaces(data.spaces);
      })
      .catch(() => {
        if (active) setDbSpaces([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const spaces = useMemo(() => {
    if (dbSpaces.length > 0) {
      return dbSpaces.map((space) => ({
        n:
          lang === "en"
            ? space.nameEn || space.namePt
            : lang === "fr"
              ? space.nameFr || space.namePt
              : space.namePt,
        d:
          lang === "en"
            ? space.descriptionEn || space.descriptionPt || ""
            : lang === "fr"
              ? space.descriptionFr || space.descriptionPt || ""
              : space.descriptionPt || "",
        b:
          lang === "en" && space.benefitsEn.length > 0
            ? space.benefitsEn
            : lang === "fr" && space.benefitsFr.length > 0
              ? space.benefitsFr
              : space.benefitsPt,
        imageUrl: space.imageUrl,
      }));
    }

    return fallbackSpaces.map((space) => ({ ...space, imageUrl: null }));
  }, [dbSpaces, fallbackSpaces, lang]);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="pros-hero-section relative min-h-[92vh] flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt=""
          className="pros-hero-image absolute inset-0 w-full h-full object-cover"
        />
        <div className="pros-hero-soft-overlay absolute inset-0" />
        <div className="pros-hero-vignette absolute inset-0" />
        <div className="pros-hero-frame-line" aria-hidden="true" />
        <div className="pros-hero-content relative mx-auto max-w-[1480px] px-6 sm:px-8 lg:px-12 py-32">
          <Reveal>
            <div className="pros-hero-copy">
              <div className="pros-hero-eyebrow eyebrow mb-5">{t("pros.eyebrow")}</div>
              <div className="pros-hero-divider" aria-hidden="true">
                <span />
                <span className="pros-hero-divider-mark">✦</span>
                <span />
              </div>
              <h1 className="pros-hero-title font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.98] tracking-normal">
                <span className="text-gradient-gold">{t("pros.hTitle")}</span>
              </h1>
              <p className="pros-hero-subtitle mt-8 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                {t("pros.hSub")}
              </p>
              <div className="pros-hero-actions mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href="#contacto"
                  className="pros-hero-primary px-8 h-14 inline-flex items-center justify-center gap-4 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.28em] hover:bg-primary/90 transition"
                >
                  {t("pros.ctaInfo")}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#contacto"
                  className="pros-hero-secondary px-8 h-14 inline-flex items-center justify-center gap-4 border border-primary/40 text-primary text-[12px] uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition"
                >
                  {t("pros.ctaVisit")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="pros-hero-benefits" aria-label="Diferenciais LOMA para profissionais">
                {[
                  { icon: Crown, label: "Ambiente premium" },
                  { icon: Sparkles, label: "Liberdade e flexibilidade" },
                  { icon: TrendingUp, label: "Crescimento profissional" },
                ].map(({ icon: Icon, label }, index) => (
                  <div className="pros-hero-benefit" key={label}>
                    <span>
                      <Icon className="w-5 h-5" strokeWidth={1.45} />
                    </span>
                    <strong>{label}</strong>
                    {index < 2 && <i aria-hidden="true" />}
                  </div>
                ))}
              </div>
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
                    <img
                      src={s.imageUrl || SPACE_IMAGES[i % SPACE_IMAGES.length]}
                      alt={s.n}
                      loading="lazy"
                      className="w-full h-full object-cover transition duration-[1200ms] group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <h3 className="font-display text-2xl leading-tight">{s.n}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                    <ul className="mt-2 space-y-1.5 text-[12px] text-foreground/80">
                      {s.b.map((bn) => (
                        <li key={bn} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {bn}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#contacto"
                      className="mt-auto pt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-primary group-hover:gap-3 transition-all"
                    >
                      {t("pros.moreCta")} <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
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
              <img
                src={loungeImg}
                alt=""
                loading="lazy"
                className="w-full aspect-[4/3] object-cover ring-gold-glow"
              />
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
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
                {t("pros.experienceBody")}
              </p>
              <a
                href="#contacto"
                className="mt-10 inline-flex items-center gap-3 px-8 h-14 border border-primary/40 text-primary text-[12px] uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition"
              >
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
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            {t("pros.formIntro")}
          </p>
          <Reveal>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSending(true);
                setSent(false);
                setError("");

                const form = e.currentTarget;
                const formData = new FormData(form);
                const response = await fetch("/api/professional-inquiry", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    age: formData.get("age"),
                    phone: formData.get("phone"),
                    instagram: formData.get("instagram"),
                    area: formData.get("area"),
                    yearsExperience: formData.get("yearsExperience"),
                    rentalExperience: formData.get("rentalExperience"),
                    ownClientBase: formData.get("ownClientBase"),
                    mainService: formData.get("mainService"),
                    mostPerformedServices: formData.get("mostPerformedServices"),
                    workspaceExpectations: formData.get("workspaceExpectations"),
                    whyLoma: formData.get("whyLoma"),
                    clientExperienceValue: formData.get("clientExperienceValue"),
                    positioning: formData.get("positioning"),
                    organizedSchedule: formData.get("organizedSchedule"),
                    createsContent: formData.get("createsContent"),
                    partnershipMeaning: formData.get("partnershipMeaning"),
                    environmentAvoid: formData.get("environmentAvoid"),
                    differentiator: formData.get("differentiator"),
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
              className="mt-14 grid gap-5 border border-border bg-card p-8 sm:grid-cols-2 sm:p-10"
            >
              <Field name="name" label={t("pros.fName")} required />
              <Field name="email" label={t("pros.fEmail")} type="email" required />
              <Field name="age" label={t("pros.fAge")} type="number" required />
              <Field name="phone" label={t("pros.fPhone")} type="tel" required />
              <Field name="instagram" label={t("pros.fInsta")} placeholder="@" required />
              <SelectField
                name="area"
                label={t("pros.fArea")}
                options={t("pros.fAreaOptions", { returnObjects: true }) as string[]}
                required
              />
              <Field name="yearsExperience" label={t("pros.fYears")} required />
              <SelectField
                name="rentalExperience"
                label={t("pros.fRental")}
                options={t("pros.fYesNo", { returnObjects: true }) as string[]}
                required
              />
              <SelectField
                name="ownClientBase"
                label={t("pros.fClientBase")}
                options={t("pros.fClientBaseOptions", { returnObjects: true }) as string[]}
                required
              />
              <SelectField
                name="organizedSchedule"
                label={t("pros.fOrganized")}
                options={t("pros.fYesNo", { returnObjects: true }) as string[]}
                required
              />
              <SelectField
                name="createsContent"
                label={t("pros.fContent")}
                options={t("pros.fYesNo", { returnObjects: true }) as string[]}
                required
              />
              <div className="hidden sm:block" />
              <TextAreaField name="mainService" label={t("pros.fMainService")} required />
              <TextAreaField
                name="mostPerformedServices"
                label={t("pros.fMostServices")}
                required
              />
              <TextAreaField name="workspaceExpectations" label={t("pros.fWorkspace")} required />
              <TextAreaField name="whyLoma" label={t("pros.fWhyLoma")} required />
              <TextAreaField
                name="clientExperienceValue"
                label={t("pros.fClientExperience")}
                required
              />
              <TextAreaField name="positioning" label={t("pros.fPositioning")} required />
              <TextAreaField name="partnershipMeaning" label={t("pros.fPartnership")} required />
              <TextAreaField name="environmentAvoid" label={t("pros.fAvoid")} required />
              <TextAreaField name="differentiator" label={t("pros.fDifferentiator")} required />
              <button
                disabled={sending}
                className="sm:col-span-2 mt-2 w-full px-6 py-4 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.3em] hover:bg-primary/90 transition disabled:opacity-60"
              >
                {sending ? "A enviar..." : t("pros.fSubmit")}
              </button>
              {sent && (
                <p className="sm:col-span-2 text-sm text-primary text-center">{t("pros.fSent")}</p>
              )}
              {error && (
                <p className="sm:col-span-2 text-sm text-destructive text-center">{error}</p>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow">
        {label}
        {required && " *"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border border-border px-4 py-3 text-sm focus:border-primary outline-none transition placeholder:text-muted-foreground/50"
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  options,
  required,
}: {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow">
        {label}
        {required && " *"}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="mt-2 h-[46px] w-full border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary"
      >
        <option value="" disabled>
          Selecione
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block sm:col-span-2">
      <span className="eyebrow">
        {label}
        {required && " *"}
      </span>
      <textarea
        name={name}
        rows={4}
        required={required}
        className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition focus:border-primary"
      />
    </label>
  );
}
