import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import type { ProfessionalRecord } from "@/lib/admin/professionals.server";
import type { PublicServiceCategory, ServiceRecord } from "@/lib/admin/services.server";
import type { BookingAvailabilitySlot } from "@/lib/admin/appointments.server";

type BookingService = ServiceRecord & {
  displayName: string;
};

type BookingProfessional = ProfessionalRecord & {
  displayName: string;
};

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
  const [dbCategories, setDbCategories] = useState<PublicServiceCategory[]>([]);
  const [dbPros, setDbPros] = useState<ProfessionalRecord[]>([]);
  const [slots, setSlots] = useState<BookingAvailabilitySlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const lang = (i18n.language?.slice(0, 2) ?? "pt") as "pt" | "en" | "fr";
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    serviceId: "",
    professionalId: "",
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

  const services = useMemo<BookingService[]>(
    () =>
      dbCategories.flatMap((category) =>
        category.services.map((service) => ({
          ...service,
          displayName:
            lang === "en"
              ? service.nameEn || service.namePt
              : lang === "fr"
                ? service.nameFr || service.namePt
                : service.namePt,
        })),
      ),
    [dbCategories, lang],
  );

  const pros = useMemo<BookingProfessional[]>(
    () => dbPros.map((professional) => ({ ...professional, displayName: professional.name })),
    [dbPros],
  );

  const selectedService = services.find((service) => service.id === data.serviceId);
  const selectedProfessional = pros.find((professional) => professional.id === data.professionalId);
  const hasAvailableSlots = slots.some((slot) => slot.available);

  const dates = useMemo(() => {
    const out: { label: string; iso: string; day: string }[] = [];
    for (let i = 1; i <= 21; i++) {
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

  useEffect(() => {
    if (!data.serviceId || !data.professionalId || !data.date) {
      setSlots([]);
      return;
    }

    const controller = new AbortController();
    setIsLoadingSlots(true);

    const params = new URLSearchParams({
      serviceId: data.serviceId,
      professionalId: data.professionalId,
      date: data.date,
    });

    fetch(`/api/booking/availability?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Falha ao carregar horários");
        return (await response.json()) as { slots: BookingAvailabilitySlot[] };
      })
      .then((payload) => setSlots(payload.slots))
      .catch((reason) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setSlots([]);
      })
      .finally(() => setIsLoadingSlots(false));

    return () => controller.abort();
  }, [data.serviceId, data.professionalId, data.date]);

  useEffect(() => {
    if (!data.time || isLoadingSlots) return;

    const selectedSlot = slots.find((slot) => slot.time === data.time);
    if (!selectedSlot?.available) {
      setData((current) => ({ ...current, time: "" }));
      setError(t("booking.timeNeedsReselect"));
    }
  }, [data.time, isLoadingSlots, slots, t]);

  const steps = [
    t("booking.chooseService"),
    t("booking.chooseProfessional"),
    t("booking.chooseSlot"),
    t("booking.yourDetails"),
  ];
  const canNext = [
    data.serviceId,
    data.professionalId,
    data.date && data.time,
    data.name && data.email,
  ][step];

  function resetBooking() {
    setDone(false);
    setStep(0);
    setData({
      serviceId: "",
      professionalId: "",
      date: "",
      time: "",
      name: "",
      email: "",
      phone: "",
      notes: "",
    });
    setSlots([]);
  }

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
      const payload = await response?.json().catch(() => null);
      setError(payload?.message || "Não foi possível enviar o pedido. Tente novamente.");
      if (response?.status === 409) setData((current) => ({ ...current, time: "" }));
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <section className="flex min-h-[70vh] items-center py-24">
        <div className="mx-auto max-w-xl px-6 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <Check className="h-8 w-8" />
          </div>
          <div className="eyebrow mb-3">{t("booking.confirmed")}</div>
          <h1 className="font-display text-4xl md:text-5xl">{selectedService?.displayName}</h1>
          <p className="mt-5 text-muted-foreground">
            {data.date} · {data.time} · {selectedProfessional?.displayName}
          </p>
          <p className="mt-6 text-sm text-muted-foreground">{t("booking.confirmedBody")}</p>
          <button
            onClick={resetBooking}
            className="mt-10 border border-primary/40 px-6 py-3 text-[12px] uppercase tracking-[0.28em] text-primary"
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
              className={`h-px transition-all duration-500 ${i <= step ? "w-12 bg-primary" : "w-6 bg-border"}`}
            />
          ))}
        </div>
        <div className="eyebrow mt-3 text-center">
          {t("booking.step")} {step + 1} {t("booking.of")} {steps.length} · {steps[step]}
        </div>

        <div className="mt-12 min-h-[360px] border border-border bg-card p-6 md:p-10">
          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {services.length === 0 && (
                <p className="text-sm text-muted-foreground">Carregando serviços...</p>
              )}
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setData({ ...data, serviceId: service.id, date: "", time: "" })}
                  className={`border p-5 text-left transition ${data.serviceId === service.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                >
                  <div className="font-display text-lg">{service.displayName}</div>
                  {service.durationLabel && (
                    <div className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {service.durationLabel}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {pros.length === 0 && (
                <p className="text-sm text-muted-foreground">Carregando profissionais...</p>
              )}
              {pros.map((professional) => (
                <button
                  key={professional.id}
                  onClick={() =>
                    setData({ ...data, professionalId: professional.id, date: "", time: "" })
                  }
                  className={`border p-5 text-left transition ${data.professionalId === professional.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                >
                  <div className="font-display text-lg">{professional.displayName}</div>
                  {professional.rolePt && (
                    <div className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {professional.rolePt}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {dates.map((d) => (
                  <button
                    key={d.iso}
                    onClick={() => setData({ ...data, date: d.iso, time: "" })}
                    className={`border p-3 text-center transition ${data.date === d.iso ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"}`}
                  >
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {d.label}
                    </div>
                    <div className="mt-1 font-display text-xl">{d.day}</div>
                  </button>
                ))}
              </div>

              {data.date && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {isLoadingSlots && (
                    <p className="col-span-full text-sm text-muted-foreground">
                      Carregando horários...
                    </p>
                  )}
                  {!isLoadingSlots &&
                    slots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setData({ ...data, time: slot.time })}
                        className={`border py-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-35 ${
                          data.time === slot.time
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  {!isLoadingSlots && !hasAvailableSlots && (
                    <p className="col-span-full text-sm leading-relaxed text-muted-foreground">
                      {t("booking.noSlots")}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 sm:grid-cols-2">
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
                    className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="eyebrow">{t("booking.notes")}</span>
                <textarea
                  value={data.notes}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  rows={3}
                  className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <div className="mt-4 border border-primary/30 bg-primary/5 p-5 sm:col-span-2">
                <div className="eyebrow mb-3">{t("booking.summary")}</div>
                <div className="space-y-1 text-sm text-foreground">
                  <div>{selectedService?.displayName}</div>
                  <div className="text-muted-foreground">
                    {selectedProfessional?.displayName} · {data.date} · {data.time}
                  </div>
                </div>
              </div>
              {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 px-5 py-3 text-[12px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => canNext && setStep(step + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-2 bg-primary px-7 py-3 text-[12px] uppercase tracking-[0.25em] text-primary-foreground disabled:opacity-30"
            >
              {t("common.continue")}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={submitBooking}
              disabled={!canNext || sending}
              className="inline-flex items-center gap-2 bg-primary px-7 py-3 text-[12px] uppercase tracking-[0.25em] text-primary-foreground disabled:opacity-30"
            >
              {sending ? "A enviar..." : t("booking.pay")}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
