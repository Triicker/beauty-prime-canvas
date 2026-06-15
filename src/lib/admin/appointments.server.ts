import "@tanstack/react-start/server-only";

import type { PoolClient } from "pg";

import { getPool, query, queryOne } from "./db.server";
import type {
  AppointmentEventRecord,
  AppointmentRecord,
  AppointmentStatus,
} from "./appointments.types";

export const BOOKING_TIMEZONE = "Europe/Lisbon";
const BOOKING_OPEN_TIME = "09:30";
const BOOKING_CLOSE_TIME = "19:00";
const BOOKING_ACTIVE_STATUSES = ["pending", "confirmed"] as const;

export const BOOKING_TIMES = [
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

export type BookingAvailabilitySlot = {
  time: string;
  available: boolean;
};

export type BookingRequestInput = {
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
};

type AppointmentRow = {
  id: string;
  source: string;
  source_event_id: string | null;
  source_booking_id: string | null;
  status: AppointmentStatus;
  service_id: string | null;
  professional_id: string | null;
  service: string | null;
  professional: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  starts_at: string | null;
  ends_at: string | null;
  duration_minutes: number | null;
  timezone: string | null;
  notes: string | null;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type AppointmentEventRow = {
  id: string;
  appointment_id: string;
  type: string;
  actor: string;
  message: string;
  payload: Record<string, unknown>;
  created_at: string;
};

type BookingServiceRow = {
  id: string;
  name_pt: string;
  duration_label: string | null;
};

type BookingProfessionalRow = {
  id: string;
  name: string;
};

type AppointmentPatchInput = {
  status?: AppointmentStatus;
  date?: string;
  time?: string;
};

function normalizeAppointment(
  row: AppointmentRow,
  events: AppointmentEventRecord[] = [],
): AppointmentRecord {
  return {
    id: row.id,
    source: row.source,
    sourceEventId: row.source_event_id,
    sourceBookingId: row.source_booking_id,
    status: row.status,
    serviceId: row.service_id,
    professionalId: row.professional_id,
    service: row.service,
    professional: row.professional,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    durationMinutes: row.duration_minutes,
    timezone: row.timezone,
    notes: row.notes,
    payload: row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    googleCalendarUrl: buildGoogleCalendarUrl({
      service: row.service,
      professional: row.professional,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      notes: row.notes,
    }),
    events,
  };
}

function normalizeAppointmentEvent(row: AppointmentEventRow): AppointmentEventRecord {
  return {
    id: row.id,
    type: row.type,
    actor: row.actor,
    message: row.message,
    payload: row.payload,
    createdAt: row.created_at,
  };
}

async function hasAppointmentsTable() {
  const row = await queryOne<{ exists: boolean }>(
    "select to_regclass('public.appointments') is not null as exists",
  );
  return Boolean(row?.exists);
}

async function hasAppointmentEventsTable() {
  const row = await queryOne<{ exists: boolean }>(
    "select to_regclass('public.appointment_events') is not null as exists",
  );
  return Boolean(row?.exists);
}

export function parseDurationMinutes(label?: string | null) {
  if (!label) return 60;

  const normalized = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const hourMatch = normalized.match(/(\d+(?:[,.]\d+)?)\s*h/);
  const minMatch = normalized.match(/(\d+)\s*(?:min|m)/);

  let minutes = 0;
  if (hourMatch) minutes += Math.round(Number(hourMatch[1].replace(",", ".")) * 60);
  if (minMatch) minutes += Number(minMatch[1]);

  if (minutes > 0) return minutes;

  const firstNumber = normalized.match(/\d+/);
  return firstNumber ? Number(firstNumber[0]) : 60;
}

function validateDurationMinutes(duration: number) {
  if (!Number.isFinite(duration) || duration < 15 || duration > 8 * 60) {
    throw new Error("Duração do serviço inválida.");
  }

  return duration;
}

function getTimeZoneParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function makeZonedDate(date: string, time: string, timeZone = BOOKING_TIMEZONE) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const zoneParts = getTimeZoneParts(utcGuess, timeZone);
  const zoneAsUtc = Date.UTC(
    Number(zoneParts.year),
    Number(zoneParts.month) - 1,
    Number(zoneParts.day),
    Number(zoneParts.hour),
    Number(zoneParts.minute),
    Number(zoneParts.second),
  );
  const desiredAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);

  return new Date(desiredAsUtc - (zoneAsUtc - utcGuess.getTime()));
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function getLisbonWeekday(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIMEZONE,
    weekday: "short",
  }).format(date);
}

function validateBookingDateTime(date: string, time: string) {
  if (!isValidIsoDate(date)) {
    throw new Error("Data inválida.");
  }

  if (!BOOKING_TIMES.includes(time)) {
    throw new Error("Horário fora das opções disponíveis.");
  }
}

function validateBookingWindow(input: {
  date: string;
  time: string;
  startsAt: Date;
  endsAt: Date;
}) {
  validateBookingDateTime(input.date, input.time);

  if (input.startsAt.getTime() <= Date.now()) {
    throw new Error("Não é possível agendar em horário passado.");
  }

  const weekday = getLisbonWeekday(input.startsAt);
  if (weekday === "Sun" || weekday === "Mon") {
    throw new Error("O salão está encerrado neste dia.");
  }

  const startMinutes = toMinutes(input.time);
  const endMinutes = startMinutes + Math.round((input.endsAt.getTime() - input.startsAt.getTime()) / 60_000);

  if (startMinutes < toMinutes(BOOKING_OPEN_TIME) || endMinutes > toMinutes(BOOKING_CLOSE_TIME)) {
    throw new Error("Horário fora do expediente.");
  }
}

function toSqlTimestamptz(date: Date) {
  return date.toISOString();
}

function googleDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().replaceAll("-", "").replaceAll(":", "").split(".")[0] + "Z";
}

function buildGoogleCalendarUrl(input: {
  service: string | null;
  professional: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  startsAt: string | null;
  endsAt: string | null;
  notes: string | null;
}) {
  if (!input.startsAt || !input.endsAt) return null;

  const details = [
    input.customerName ? `Cliente: ${input.customerName}` : null,
    input.customerEmail ? `Email: ${input.customerEmail}` : null,
    input.customerPhone ? `Telefone: ${input.customerPhone}` : null,
    input.professional ? `Profissional: ${input.professional}` : null,
    input.notes ? `Notas: ${input.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `LOMA - ${input.service || "Agendamento"}`,
    dates: `${googleDate(input.startsAt)}/${googleDate(input.endsAt)}`,
    details,
    location: "LOMA Clinic & Beauty Hair, R. da Azenha 6, 2560-474 Silveira, Torres Vedras",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

async function getBookingService(id: string) {
  return queryOne<BookingServiceRow>(
    `
      select id, name_pt, duration_label
      from services
      where id = $1
        and is_visible = true
    `,
    [id],
  );
}

async function getBookingProfessional(id: string) {
  return queryOne<BookingProfessionalRow>(
    `
      select id, name
      from professionals
      where id = $1
        and is_visible = true
    `,
    [id],
  );
}

async function queryOneWithClient<T>(
  client: PoolClient,
  text: string,
  params: readonly unknown[] = [],
) {
  const result = await client.query<T>(text, [...params]);
  return result.rows[0] ?? null;
}

async function hasProfessionalConflict(
  professionalId: string,
  startsAt: Date,
  endsAt: Date,
  excludeId?: string,
  client?: PoolClient,
) {
  const sql = `
    select count(*) as count
    from appointments
    where professional_id = $1
      and status = any($4::text[])
      and starts_at is not null
      and ends_at is not null
      and tstzrange(starts_at, ends_at, '[)') && tstzrange($2::timestamptz, $3::timestamptz, '[)')
      ${excludeId ? "and id <> $5" : ""}
  `;

  const params = excludeId
    ? [
        professionalId,
        toSqlTimestamptz(startsAt),
        toSqlTimestamptz(endsAt),
        [...BOOKING_ACTIVE_STATUSES],
        excludeId,
      ]
    : [
        professionalId,
        toSqlTimestamptz(startsAt),
        toSqlTimestamptz(endsAt),
        [...BOOKING_ACTIVE_STATUSES],
      ];

  const row = client
    ? await queryOneWithClient<{ count: string }>(client, sql, params)
    : await queryOne<{ count: string }>(sql, params);

  return Number(row?.count ?? 0) > 0;
}

async function lockProfessionalSchedule(client: PoolClient, professionalId: string) {
  await client.query("select pg_advisory_xact_lock(hashtext($1))", [
    `loma-appointment:${professionalId}`,
  ]);
}

function isBookingConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23P01"
  );
}

function buildAppointmentWindow(date: string, time: string, duration: number) {
  validateBookingDateTime(date, time);

  const startsAt = makeZonedDate(date, time);
  const endsAt = new Date(startsAt.getTime() + duration * 60_000);

  validateBookingWindow({ date, time, startsAt, endsAt });

  return { startsAt, endsAt };
}

async function getAppointmentForUpdate(client: PoolClient, id: string) {
  return queryOneWithClient<AppointmentRow>(
    client,
    `
      select *
      from appointments
      where id = $1
      for update
    `,
    [id],
  );
}

async function insertAppointmentEvent(
  input: {
    appointmentId: string;
    type: string;
    actor?: string;
    message: string;
    payload?: Record<string, unknown>;
  },
  client?: PoolClient,
) {
  const sql = `
    insert into appointment_events (appointment_id, type, actor, message, payload)
    values ($1, $2, $3, $4, $5::jsonb)
  `;
  const params = [
    input.appointmentId,
    input.type,
    input.actor ?? "system",
    input.message,
    JSON.stringify(input.payload ?? {}),
  ];

  try {
    if (client) {
      await client.query(sql, params);
    } else {
      await query(sql, params);
    }
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "42P01"
    ) {
      return;
    }

    throw error;
  }
}

async function listAppointmentEvents(appointmentIds: string[]) {
  if (appointmentIds.length === 0 || !(await hasAppointmentEventsTable())) {
    return new Map<string, AppointmentEventRecord[]>();
  }

  const rows = await query<AppointmentEventRow>(
    `
      select
        id,
        appointment_id,
        type,
        actor,
        message,
        payload,
        created_at::text
      from appointment_events
      where appointment_id = any($1::uuid[])
      order by created_at desc
    `,
    [appointmentIds],
  );

  const grouped = new Map<string, AppointmentEventRecord[]>();

  for (const row of rows) {
    const items = grouped.get(row.appointment_id) ?? [];
    items.push(normalizeAppointmentEvent(row));
    grouped.set(row.appointment_id, items);
  }

  return grouped;
}

export async function listBookingAvailability(input: {
  serviceId: string;
  professionalId: string;
  date: string;
}) {
  const service = await getBookingService(input.serviceId);
  const professional = await getBookingProfessional(input.professionalId);
  if (!service || !professional) return [];

  const duration = validateDurationMinutes(parseDurationMinutes(service.duration_label));

  const slots = await Promise.all(
    BOOKING_TIMES.map(async (time) => {
      let start: Date;
      let end: Date;

      try {
        const window = buildAppointmentWindow(input.date, time, duration);
        start = window.startsAt;
        end = window.endsAt;
      } catch {
        return { time, available: false };
      }

      const available = !(await hasProfessionalConflict(input.professionalId, start, end));
      return { time, available };
    }),
  );

  return slots satisfies BookingAvailabilitySlot[];
}

export async function createAppointmentFromBooking(input: BookingRequestInput) {
  const service = await getBookingService(input.serviceId);
  const professional = await getBookingProfessional(input.professionalId);

  if (!service || !professional) {
    throw new Error("Serviço ou profissional inválido.");
  }

  const duration = validateDurationMinutes(parseDurationMinutes(service.duration_label));
  const { startsAt, endsAt } = buildAppointmentWindow(input.date, input.time, duration);

  const payload = {
    ...input,
    service: service.name_pt,
    professional: professional.name,
    durationMinutes: duration,
  };

  const client = await getPool().connect();

  try {
    await client.query("begin");
    await lockProfessionalSchedule(client, professional.id);

    if (await hasProfessionalConflict(professional.id, startsAt, endsAt, undefined, client)) {
      throw new Error("Horário indisponível para este profissional.");
    }

    const row = await queryOneWithClient<AppointmentRow>(
      client,
      `
        insert into appointments (
          source,
          status,
          service_id,
          professional_id,
          service,
          professional,
          customer_name,
          customer_email,
          customer_phone,
          starts_at,
          ends_at,
          duration_minutes,
          timezone,
          notes,
          payload
        )
        values (
          'site',
          'pending',
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8::timestamptz,
          $9::timestamptz,
          $10,
          $11,
          $12,
          $13::jsonb
        )
        returning *
      `,
      [
        service.id,
        professional.id,
        service.name_pt,
        professional.name,
        input.name,
        input.email,
        input.phone ?? null,
        toSqlTimestamptz(startsAt),
        toSqlTimestamptz(endsAt),
        duration,
        BOOKING_TIMEZONE,
        input.notes ?? null,
        JSON.stringify(payload),
      ],
    );

    if (!row) throw new Error("Agendamento não foi criado.");

    await insertAppointmentEvent(
      {
        appointmentId: row.id,
        type: "created",
        actor: "client",
        message: "Agendamento criado pelo cliente.",
        payload: {
          status: row.status,
          startsAt: row.starts_at,
          endsAt: row.ends_at,
          service: row.service,
          professional: row.professional,
        },
      },
      client,
    );

    await client.query("commit");
    return normalizeAppointment(row);
  } catch (error) {
    await client.query("rollback").catch(() => undefined);

    if (isBookingConstraintError(error)) {
      throw new Error("Horário indisponível para este profissional.");
    }

    throw error;
  } finally {
    client.release();
  }
}

export async function listAdminAppointments() {
  if (!(await hasAppointmentsTable())) return [];

  const rows = await query<AppointmentRow>(`
    select *
    from appointments
    order by coalesce(starts_at, created_at) desc
    limit 200
  `);

  const events = await listAppointmentEvents(rows.map((row) => row.id));
  return rows.map((row) => normalizeAppointment(row, events.get(row.id) ?? []));
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  return updateAdminAppointment(id, { status });
}

export async function updateAdminAppointment(id: string, input: AppointmentPatchInput) {
  if (!(await hasAppointmentsTable())) return null;

  const client = await getPool().connect();

  try {
    await client.query("begin");

    const current = await getAppointmentForUpdate(client, id);
    if (!current) {
      await client.query("rollback");
      return null;
    }

    const nextStatus = input.status ?? current.status;
    const previousStatus = current.status;
    const previousStartsAt = current.starts_at;
    let startsAt = current.starts_at ? new Date(current.starts_at) : null;
    let endsAt = current.ends_at ? new Date(current.ends_at) : null;
    let duration = current.duration_minutes ?? 60;

    if (input.date || input.time) {
      if (!input.date || !input.time) {
        throw new Error("Informe data e hora para reagendar.");
      }

      if (!current.professional_id) {
        throw new Error("Agendamento sem profissional não pode ser reagendado.");
      }

      await lockProfessionalSchedule(client, current.professional_id);

      duration = validateDurationMinutes(current.duration_minutes ?? 60);
      const window = buildAppointmentWindow(input.date, input.time, duration);
      startsAt = window.startsAt;
      endsAt = window.endsAt;

      if (await hasProfessionalConflict(current.professional_id, startsAt, endsAt, id, client)) {
        throw new Error("Horário indisponível para este profissional.");
      }
    }

    const nextPayload = {
      ...current.payload,
      adminUpdatedAt: new Date().toISOString(),
      adminRescheduledTo:
        input.date && input.time ? { date: input.date, time: input.time } : undefined,
    };

    const row = await queryOneWithClient<AppointmentRow>(
      client,
      `
        update appointments
        set
          status = $2,
          starts_at = $3::timestamptz,
          ends_at = $4::timestamptz,
          duration_minutes = $5,
          timezone = $6,
          payload = $7::jsonb
        where id = $1
        returning *
      `,
      [
        id,
        nextStatus,
        startsAt ? toSqlTimestamptz(startsAt) : null,
        endsAt ? toSqlTimestamptz(endsAt) : null,
        duration,
        BOOKING_TIMEZONE,
        JSON.stringify(nextPayload),
      ],
    );

    if (!row) throw new Error("Agendamento não foi atualizado.");

    if (input.status && input.status !== previousStatus) {
      await insertAppointmentEvent(
        {
          appointmentId: id,
          type: "status_changed",
          actor: "admin",
          message: `Status alterado de ${previousStatus} para ${input.status}.`,
          payload: { previousStatus, nextStatus: input.status },
        },
        client,
      );
    }

    if (input.date && input.time && row.starts_at !== previousStartsAt) {
      await insertAppointmentEvent(
        {
          appointmentId: id,
          type: "rescheduled",
          actor: "admin",
          message: "Horário alterado pelo admin.",
          payload: {
            previousStartsAt,
            nextStartsAt: row.starts_at,
            nextEndsAt: row.ends_at,
          },
        },
        client,
      );
    }

    await client.query("commit");
    const events = await listAppointmentEvents([row.id]);
    return normalizeAppointment(row, events.get(row.id) ?? []);
  } catch (error) {
    await client.query("rollback").catch(() => undefined);

    if (isBookingConstraintError(error)) {
      throw new Error("Horário indisponível para este profissional.");
    }

    throw error;
  } finally {
    client.release();
  }
}

export async function getAdminAppointment(id: string) {
  if (!(await hasAppointmentsTable())) return null;

  const row = await queryOne<AppointmentRow>(
    `
      select *
      from appointments
      where id = $1
    `,
    [id],
  );

  if (!row) return null;
  const events = await listAppointmentEvents([row.id]);
  return normalizeAppointment(row, events.get(row.id) ?? []);
}

export async function markAppointmentEmailResent(id: string, payload: Record<string, unknown>) {
  await insertAppointmentEvent({
    appointmentId: id,
    type: "email_resent",
    actor: "admin",
    message: "Email de confirmação reenviado pelo admin.",
    payload,
  });
}
