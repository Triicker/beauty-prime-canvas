import "@tanstack/react-start/server-only";

import { query, queryOne } from "./db.server";
import type { AppointmentRecord, AppointmentStatus } from "./appointments.types";

export const BOOKING_TIMEZONE = "Europe/Lisbon";

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

type BookingServiceRow = {
  id: string;
  name_pt: string;
  duration_label: string | null;
};

type BookingProfessionalRow = {
  id: string;
  name: string;
};

function normalizeAppointment(row: AppointmentRow): AppointmentRecord {
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
  };
}

async function hasAppointmentsTable() {
  const row = await queryOne<{ exists: boolean }>(
    "select to_regclass('public.appointments') is not null as exists",
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

async function hasProfessionalConflict(
  professionalId: string,
  startsAt: Date,
  endsAt: Date,
  excludeId?: string,
) {
  const row = await queryOne<{ count: string }>(
    `
      select count(*) as count
      from appointments
      where professional_id = $1
        and status in ('pending', 'confirmed')
        and ($2::timestamptz, $3::timestamptz) overlaps (starts_at, ends_at)
        ${excludeId ? "and id <> $4" : ""}
    `,
    excludeId
      ? [professionalId, toSqlTimestamptz(startsAt), toSqlTimestamptz(endsAt), excludeId]
      : [professionalId, toSqlTimestamptz(startsAt), toSqlTimestamptz(endsAt)],
  );

  return Number(row?.count ?? 0) > 0;
}

export async function listBookingAvailability(input: {
  serviceId: string;
  professionalId: string;
  date: string;
}) {
  const service = await getBookingService(input.serviceId);
  const professional = await getBookingProfessional(input.professionalId);
  if (!service || !professional) return [];

  const duration = parseDurationMinutes(service.duration_label);

  const slots = await Promise.all(
    BOOKING_TIMES.map(async (time) => {
      const start = makeZonedDate(input.date, time);
      const end = new Date(start.getTime() + duration * 60_000);
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

  const duration = parseDurationMinutes(service.duration_label);
  const startsAt = makeZonedDate(input.date, input.time);
  const endsAt = new Date(startsAt.getTime() + duration * 60_000);

  if (await hasProfessionalConflict(input.professionalId, startsAt, endsAt)) {
    throw new Error("Horário indisponível para este profissional.");
  }

  const payload = {
    ...input,
    service: service.name_pt,
    professional: professional.name,
    durationMinutes: duration,
  };

  const row = await queryOne<AppointmentRow>(
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
  return normalizeAppointment(row);
}

export async function listAdminAppointments() {
  if (!(await hasAppointmentsTable())) return [];

  const rows = await query<AppointmentRow>(`
    select *
    from appointments
    order by coalesce(starts_at, created_at) desc
    limit 200
  `);

  return rows.map(normalizeAppointment);
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  if (!(await hasAppointmentsTable())) return null;

  const row = await queryOne<AppointmentRow>(
    `
      update appointments
      set status = $2
      where id = $1
      returning *
    `,
    [id, status],
  );

  return row ? normalizeAppointment(row) : null;
}
