import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarCheck,
  CalendarPlus,
  Clock,
  Mail,
  Phone,
  RefreshCw,
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

function formatDate(value: string | null) {
  if (!value) return "Data não informada";
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Lisbon",
  }).format(new Date(value));
}

function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savingId, setSavingId] = useState("");

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

  async function loadAppointments() {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await fetch("/api/admin/appointments");
      if (!response.ok) throw new Error("Falha ao carregar agendamentos");
      const data = (await response.json()) as { appointments: AppointmentRecord[] };
      setAppointments(data.appointments);
    } catch {
      setLoadError("Não foi possível carregar os agendamentos.");
    } finally {
      setIsLoading(false);
    }
  }

  async function changeStatus(appointment: AppointmentRecord, status: AppointmentStatus) {
    setSavingId(appointment.id);

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
    } finally {
      setSavingId("");
    }
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
            {appointments.map((appointment) => (
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
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
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
