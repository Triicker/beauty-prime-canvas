import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  Clipboard,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Save,
  Send,
  XCircle,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  APPOINTMENT_STATUSES,
  type AppointmentRecord,
  type AppointmentStatus,
} from "@/lib/admin/appointments.types";

export const Route = createFileRoute("/admin/agendamentos")({
  component: AdminAppointmentsPage,
});

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  reschedule: "Reagendar",
  cancelled: "Cancelado",
  completed: "Concluído",
};

function formatDateInput(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function formatTimeInput(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function formatDate(value: string | null) {
  if (!value) return "Data não informada";
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Lisbon",
  }).format(new Date(value));
}

function digitsOnly(value: string | null) {
  return (value ?? "").replace(/\D/g, "");
}

function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [drafts, setDrafts] = useState<Record<string, { date: string; time: string }>>({});
  const [filters, setFilters] = useState({
    date: "",
    professional: "all",
    service: "all",
    status: "all",
  });

  const counts = useMemo(
    () =>
      APPOINTMENT_STATUSES.reduce(
        (acc, status) => {
          acc[status] = appointments.filter((appointment) => appointment.status === status).length;
          return acc;
        },
        {} as Record<AppointmentStatus, number>,
      ),
    [appointments],
  );

  const filterOptions = useMemo(
    () => ({
      professionals: Array.from(
        new Set(appointments.map((appointment) => appointment.professional).filter(Boolean)),
      ) as string[],
      services: Array.from(
        new Set(appointments.map((appointment) => appointment.service).filter(Boolean)),
      ) as string[],
    }),
    [appointments],
  );

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((appointment) => {
        if (filters.status !== "all" && appointment.status !== filters.status) return false;
        if (filters.professional !== "all" && appointment.professional !== filters.professional) {
          return false;
        }
        if (filters.service !== "all" && appointment.service !== filters.service) return false;
        if (filters.date && formatDateInput(appointment.startsAt) !== filters.date) return false;
        return true;
      }),
    [appointments, filters],
  );

  async function loadAppointments() {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await fetch("/api/admin/appointments");
      if (!response.ok) throw new Error("Falha ao carregar agendamentos");
      const data = (await response.json()) as { appointments: AppointmentRecord[] };
      setAppointments(data.appointments);
      setDrafts(
        Object.fromEntries(
          data.appointments.map((appointment) => [
            appointment.id,
            {
              date: formatDateInput(appointment.startsAt),
              time: formatTimeInput(appointment.startsAt),
            },
          ]),
        ),
      );
    } catch {
      setLoadError("Não foi possível carregar os agendamentos.");
    } finally {
      setIsLoading(false);
    }
  }

  async function changeStatus(appointment: AppointmentRecord, status: AppointmentStatus) {
    setSavingId(appointment.id);
    setActionMessage("");

    try {
      const response = await fetch(`/api/admin/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Falha ao atualizar status");
      const data = (await response.json()) as { appointment: AppointmentRecord };
      setAppointments((current) =>
        current.map((item) => (item.id === appointment.id ? data.appointment : item)),
      );
      setDrafts((current) => ({
        ...current,
        [appointment.id]: {
          date: formatDateInput(data.appointment.startsAt),
          time: formatTimeInput(data.appointment.startsAt),
        },
      }));
      setActionMessage("Status atualizado.");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Não foi possível atualizar.");
    } finally {
      setSavingId("");
    }
  }

  async function rescheduleAppointment(appointment: AppointmentRecord) {
    const draft = drafts[appointment.id];
    if (!draft?.date || !draft.time) return;

    setSavingId(appointment.id);
    setActionMessage("");

    try {
      const response = await fetch(`/api/admin/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: draft.date, time: draft.time, status: "confirmed" }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || "Falha ao reagendar");
      }

      const data = (await response.json()) as { appointment: AppointmentRecord };
      setAppointments((current) =>
        current.map((item) => (item.id === appointment.id ? data.appointment : item)),
      );
      setDrafts((current) => ({
        ...current,
        [appointment.id]: {
          date: formatDateInput(data.appointment.startsAt),
          time: formatTimeInput(data.appointment.startsAt),
        },
      }));
      setActionMessage("Horário atualizado.");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Não foi possível reagendar.");
    } finally {
      setSavingId("");
    }
  }

  async function resendConfirmation(appointment: AppointmentRecord) {
    setSavingId(appointment.id);
    setActionMessage("");

    try {
      const response = await fetch(`/api/admin/appointments/${appointment.id}/email`, {
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || "Falha ao reenviar email");
      }

      setActionMessage("Email de confirmação reenviado.");
      await loadAppointments();
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Não foi possível reenviar.");
    } finally {
      setSavingId("");
    }
  }

  async function copyContact(appointment: AppointmentRecord) {
    const text = [
      appointment.customerName,
      appointment.customerPhone,
      appointment.customerEmail,
      appointment.service,
      formatDate(appointment.startsAt),
    ]
      .filter(Boolean)
      .join(" | ");

    await navigator.clipboard.writeText(text);
    setActionMessage("Contato copiado.");
  }

  function updateDraft(id: string, field: "date" | "time", value: string) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        date: current[id]?.date ?? "",
        time: current[id]?.time ?? "",
        [field]: value,
      },
    }));
  }

  useEffect(() => {
    void loadAppointments();
  }, []);

  return (
    <section className="bg-background py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <header className="flex flex-col gap-5 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow mb-3">Admin LOMA</div>
            <h1 className="font-display text-4xl text-foreground md:text-5xl">Agendamentos</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Pedidos recebidos pelo site, com bloqueio por profissional e status interno para
              acompanhamento da equipa.
            </p>
          </div>
          <button
            type="button"
            onClick={loadAppointments}
            className="inline-flex h-11 items-center justify-center gap-2 border border-border px-5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </button>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {APPOINTMENT_STATUSES.map((status) => (
            <article key={status} className="border border-border bg-card p-5">
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {statusLabels[status]}
              </span>
              <div className="mt-4 font-display text-4xl text-foreground">{counts[status]}</div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-3 border border-border bg-card p-5 md:grid-cols-4">
          <label>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Data
            </span>
            <input
              type="date"
              value={filters.date}
              onChange={(event) => setFilters({ ...filters, date: event.target.value })}
              className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>
          <label>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Profissional
            </span>
            <select
              value={filters.professional}
              onChange={(event) => setFilters({ ...filters, professional: event.target.value })}
              className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">Todos</option>
              {filterOptions.professionals.map((professional) => (
                <option key={professional} value={professional}>
                  {professional}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Serviço
            </span>
            <select
              value={filters.service}
              onChange={(event) => setFilters({ ...filters, service: event.target.value })}
              className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">Todos</option>
              {filterOptions.services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Status
            </span>
            <select
              value={filters.status}
              onChange={(event) => setFilters({ ...filters, status: event.target.value })}
              className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">Todos</option>
              {APPOINTMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {actionMessage && (
          <p className="mt-4 border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            {actionMessage}
          </p>
        )}

        <div className="mt-8 border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-2xl text-foreground">Últimas marcações</h2>
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {appointments.length} itens
            </span>
          </div>

          {isLoading && <p className="p-6 text-sm text-muted-foreground">Carregando...</p>}
          {loadError && <p className="p-6 text-sm text-destructive">{loadError}</p>}
          {!isLoading && !loadError && appointments.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">
              Nenhum agendamento recebido ainda. Quando um cliente concluir o formulário do site, a
              marcação aparece aqui.
            </p>
          )}

          <div className="divide-y divide-border">
            {filteredAppointments.map((appointment) => (
              <article key={appointment.id} className="grid gap-5 p-5 lg:grid-cols-[1fr_220px]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary">
                      <CalendarCheck className="h-4 w-4" />
                      {appointment.source === "site" ? "Site" : appointment.source}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {statusLabels[appointment.status]}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-foreground">
                    {appointment.service || "Serviço não informado"}
                  </h3>
                  <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      {formatDate(appointment.startsAt)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-primary" />
                      {appointment.professional || "Profissional não informado"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      {appointment.customerEmail || "Email não informado"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      {appointment.customerPhone || "Telefone não informado"}
                    </span>
                  </div>
                  {appointment.customerName && (
                    <p className="mt-3 text-sm text-foreground">{appointment.customerName}</p>
                  )}
                  {appointment.notes && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {appointment.notes}
                    </p>
                  )}
                  {appointment.events.length > 0 && (
                    <div className="mt-5 border-t border-border pt-4">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        Histórico
                      </span>
                      <div className="mt-3 space-y-2">
                        {appointment.events.slice(0, 4).map((event) => (
                          <p key={event.id} className="text-xs text-muted-foreground">
                            {formatDate(event.createdAt)} · {event.message}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <div className="grid w-full max-w-xs grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={savingId === appointment.id}
                      onClick={() => void changeStatus(appointment, "confirmed")}
                      className="inline-flex h-10 items-center justify-center gap-2 bg-primary px-3 text-[10px] uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-40"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Confirmar
                    </button>
                    <button
                      type="button"
                      disabled={savingId === appointment.id}
                      onClick={() => void changeStatus(appointment, "cancelled")}
                      className="inline-flex h-10 items-center justify-center gap-2 border border-border px-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition hover:border-destructive hover:text-destructive disabled:opacity-40"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancelar
                    </button>
                  </div>
                  <label className="w-full max-w-xs">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Status interno
                    </span>
                    <select
                      value={appointment.status}
                      disabled={savingId === appointment.id}
                      onChange={(event) =>
                        void changeStatus(appointment, event.target.value as AppointmentStatus)
                      }
                      className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                    >
                      {APPOINTMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="grid w-full max-w-xs grid-cols-2 gap-2">
                    <label>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Data
                      </span>
                      <input
                        type="date"
                        value={drafts[appointment.id]?.date ?? ""}
                        disabled={savingId === appointment.id}
                        onChange={(event) =>
                          updateDraft(appointment.id, "date", event.target.value)
                        }
                        className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </label>
                    <label>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Hora
                      </span>
                      <input
                        type="time"
                        step="1800"
                        value={drafts[appointment.id]?.time ?? ""}
                        disabled={savingId === appointment.id}
                        onChange={(event) =>
                          updateDraft(appointment.id, "time", event.target.value)
                        }
                        className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    disabled={savingId === appointment.id}
                    onClick={() => void rescheduleAppointment(appointment)}
                    className="inline-flex h-10 w-full max-w-xs items-center justify-center gap-2 border border-border px-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-40"
                  >
                    <Save className="h-4 w-4" />
                    Guardar horário
                  </button>
                  <div className="grid w-full max-w-xs grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => void copyContact(appointment)}
                      className="inline-flex h-10 items-center justify-center gap-2 border border-border px-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      <Clipboard className="h-4 w-4" />
                      Copiar
                    </button>
                    {appointment.customerPhone && (
                      <a
                        href={`https://wa.me/${digitsOnly(appointment.customerPhone)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 border border-border px-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition hover:border-primary hover:text-primary"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={savingId === appointment.id || !appointment.customerEmail}
                    onClick={() => void resendConfirmation(appointment)}
                    className="inline-flex h-10 w-full max-w-xs items-center justify-center gap-2 border border-border px-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                    Reenviar email
                  </button>
                  {appointment.googleCalendarUrl && (
                    <a
                      href={appointment.googleCalendarUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 w-full max-w-xs items-center justify-center gap-2 border border-primary/40 px-4 text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                    >
                      <CalendarPlus className="h-4 w-4" />
                      Google Calendar
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
