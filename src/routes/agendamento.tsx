import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import type { ProfessionalRecord } from "@/lib/admin/professionals.server";
import type { PublicServiceCategory } from "@/lib/admin/services.server";

export const Route = createFileRoute("/agendamento")({
  head: () => ({
    meta: [
      { title: "Agendamento — LOMA Clinic & Beauty Hair" },
      { name: "description", content: "Reserve a sua experiência Loma em três passos elegantes." },
      { property: "og:title", content: "Agendamento — Loma" },
      { property: "og:description", content: "Reserve em três passos elegantes." },
      { property: "og:url", content: "https://lomaexperience.com/agendamento" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/agendamento" }],
  }),
  component: Booking,
});

function Booking() {
  const { t, i18n } = useTranslation();
  const allCategories = t("services.categories", { returnObjects: true }) as {
    name: string;
    slug: string;
    items: { name: string; price: string; time: string }[];
  }[];
  const fallbackServices = allCategories.flatMap((cat) => cat.items.map((s) => s.name));
  const fallbackPros = t("booking.professionals", { returnObjects: true }) as string[];
  const [dbCategories, setDbCategories] = useState<PublicServiceCategory[]>([]);
  const [dbPros, setDbPros] = useState<ProfessionalRecord[]>([]);
  const lang = (i18n.language?.slice(0, 2) ?? "pt") as "pt" | "en" | "fr";
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    service: "",
    pro: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch("/api/services").then(async (response) => {
        if (!response.ok) throw new Error("Falha ao carregar serviços");
        return (await response.json()) as { categories: PublicServiceCategory[] };
      }),
      fetch("/api/professionals").then(async (response) => {
        if (!response.ok) throw new Error("Falha ao carregar profissionais");
        return (await response.json()) as { professionals: ProfessionalRecord[] };
      }),
    ])
      .then(([servicesData, professionalsData]) => {
        if (!active) return;
        setDbCategories(servicesData.categories);
        setDbPros(professionalsData.professionals);
      })
      .catch(() => {
        if (!active) return;
        setDbCategories([]);
        setDbPros([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const services = useMemo(() => {
    if (dbCategories.length === 0) return fallbackServices;

    return dbCategories.flatMap((category) =>
      category.services.map((service) =>
        lang === "en"
          ? service.nameEn || service.namePt
          : lang === "fr"
            ? service.nameFr || service.namePt
            : service.namePt,
      ),
    );
  }, [dbCategories, fallbackServices, lang]);

  const pros = useMemo(() => {
    if (dbPros.length === 0) return fallbackPros;
    return dbPros.map((professional) => professional.name);
  }, [dbPros, fallbackPros]);

  const dates = useMemo(() => {
    const out: { label: string; iso: string; day: string }[] = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      out.push({
        iso: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString(undefined, { weekday: "short" }),
        day: String(d.getDate()),
      });
    }
    return out;
  }, []);
  const times = ["10:00", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30"];

  const steps = [
    t("booking.chooseService"),
    t("booking.chooseProfessional"),
    t("booking.chooseSlot"),
    t("booking.yourDetails"),
  ];
  const canNext = [data.service, data.pro, data.date && data.time, data.name && data.email][step];

  async function submitBooking() {
    if (!canNext || sending) return;

    setSending(true);
    setError("");

    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null);

    setSending(false);

    if (!response?.ok) {
      setError("Não foi possível enviar o pedido. Tente novamente.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <section className="min-h-[70vh] flex items-center py-24">
        <div className="mx-auto max-w-xl px-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-8">
            <Check className="w-8 h-8" />
          </div>
          <div className="eyebrow mb-3">{t("booking.confirmed")}</div>
          <h1 className="font-display text-4xl md:text-5xl">{data.service}</h1>
          <p className="mt-5 text-muted-foreground">
            {data.date} · {data.time} · {data.pro}
          </p>
          <p className="mt-6 text-sm text-muted-foreground">{t("booking.confirmedBody")}</p>
          <button
            onClick={() => {
              setDone(false);
              setStep(0);
              setData({
                service: "",
                pro: "",
                date: "",
                time: "",
                name: "",
                email: "",
                phone: "",
                notes: "",
              });
            }}
            className="mt-10 px-6 py-3 border border-primary/40 text-primary text-[12px] uppercase tracking-[0.28em]"
          >
            {t("booking.newBooking")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <SectionHeading eyebrow={t("booking.eyebrow")} title={t("booking.title")} />

        <div className="mt-14 flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-px transition-all duration-500 ${i <= step ? "bg-primary w-12" : "bg-border w-6"}`}
            />
          ))}
        </div>
        <div className="text-center mt-3 eyebrow">
          {t("booking.step")} {step + 1} {t("booking.of")} {steps.length} · {steps[step]}
        </div>

        <div className="mt-12 border border-border bg-card p-6 md:p-10 min-h-[360px]">
          {step === 0 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((s) => (
                <button
                  key={s}
                  onClick={() => setData({ ...data, service: s })}
                  className={`text-left p-5 border transition ${data.service === s ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                >
                  <div className="font-display text-lg">{s}</div>
                </button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {pros.map((p) => (
                <button
                  key={p}
                  onClick={() => setData({ ...data, pro: p })}
                  className={`text-left p-5 border transition ${data.pro === p ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                >
                  <div className="font-display text-lg">{p}</div>
                </button>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {dates.map((d) => (
                  <button
                    key={d.iso}
                    onClick={() => setData({ ...data, date: d.iso })}
                    className={`p-3 border text-center transition ${data.date === d.iso ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"}`}
                  >
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {d.label}
                    </div>
                    <div className="font-display text-xl mt-1">{d.day}</div>
                  </button>
                ))}
              </div>
              {data.date && (
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {times.map((tm) => (
                    <button
                      key={tm}
                      onClick={() => setData({ ...data, time: tm })}
                      className={`py-3 border text-sm transition ${data.time === tm ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"}`}
                    >
                      {tm}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { k: "name", t: t("booking.name") },
                { k: "email", t: t("booking.email") },
                { k: "phone", t: t("booking.phone") },
              ].map((f) => (
                <label key={f.k} className="block">
                  <span className="eyebrow">{f.t}</span>
                  <input
                    type={f.k === "email" ? "email" : f.k === "phone" ? "tel" : "text"}
                    required={f.k === "name" || f.k === "email"}
                    value={(data as Record<string, string>)[f.k]}
                    onChange={(e) => setData({ ...data, [f.k]: e.target.value })}
                    className="mt-2 w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-primary text-sm"
                  />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="eyebrow">{t("booking.notes")}</span>
                <textarea
                  value={data.notes}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  rows={3}
                  className="mt-2 w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-primary text-sm"
                />
              </label>
              <div className="sm:col-span-2 mt-4 p-5 border border-primary/30 bg-primary/5">
                <div className="eyebrow mb-3">{t("booking.summary")}</div>
                <div className="text-sm text-foreground space-y-1">
                  <div>{data.service}</div>
                  <div className="text-muted-foreground">
                    {data.pro} · {data.date} · {data.time}
                  </div>
                </div>
              </div>
              {error && <p className="sm:col-span-2 text-sm text-destructive">{error}</p>}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 px-5 py-3 text-[12px] uppercase tracking-[0.25em] text-muted-foreground disabled:opacity-30 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => canNext && setStep(step + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.25em] disabled:opacity-30"
            >
              {t("common.continue")}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submitBooking}
              disabled={!canNext || sending}
              className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.25em] disabled:opacity-30"
            >
              {sending ? "A enviar..." : t("booking.pay")}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
