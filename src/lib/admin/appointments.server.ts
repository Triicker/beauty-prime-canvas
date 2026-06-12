import "@tanstack/react-start/server-only";

import { query, queryOne } from "./db.server";
import type { AppointmentRecord, AppointmentStatus } from "./appointments.types";

type AppointmentRow = {
  id: string;
  source: string;
  source_event_id: string | null;
  source_booking_id: string | null;
  status: AppointmentStatus;
  service: string | null;
  professional: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  starts_at: string | null;
  ends_at: string | null;
  timezone: string | null;
  notes: string | null;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type AppointmentInput = {
  source: string;
  sourceEventId?: string | null;
  sourceBookingId?: string | null;
  status?: AppointmentStatus;
  service?: string | null;
  professional?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  timezone?: string | null;
  notes?: string | null;
  payload: Record<string, unknown>;
};

function normalizeAppointment(row: AppointmentRow): AppointmentRecord {
  return {
    id: row.id,
    source: row.source,
    sourceEventId: row.source_event_id,
    sourceBookingId: row.source_booking_id,
    status: row.status,
    service: row.service,
    professional: row.professional,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    timezone: row.timezone,
    notes: row.notes,
    payload: row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function hasAppointmentsTable() {
  const row = await queryOne<{ exists: boolean }>(
    "select to_regclass('public.appointments') is not null as exists",
  );
  return Boolean(row?.exists);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    const parsed = asString(value);
    if (parsed) return parsed;
  }
  return null;
}

function firstRecord(...values: unknown[]) {
  for (const value of values) {
    const parsed = asRecord(value);
    if (parsed) return parsed;
  }
  return null;
}

function firstArray(...values: unknown[]) {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

function readNested(record: Record<string, unknown> | null, keys: string[]) {
  let current: unknown = record;
  for (const key of keys) {
    const obj = asRecord(current);
    if (!obj) return null;
    current = obj[key];
  }
  return current;
}

function appointmentStatusFromCal(eventType: string | null): AppointmentStatus {
  const event = eventType?.toLowerCase() ?? "";
  if (event.includes("cancel")) return "cancelled";
  if (event.includes("resched")) return "reschedule";
  if (event.includes("complete")) return "completed";
  return "pending";
}

function extractNotes(payload: Record<string, unknown>) {
  const responses = asRecord(payload.responses);
  const notesResponse = firstRecord(
    responses?.notes,
    responses?.Observações,
    responses?.observacoes,
  );
  return firstString(
    notesResponse?.value,
    notesResponse?.label,
    payload.notes,
    payload.description,
    payload.additionalNotes,
  );
}

export function appointmentFromCalWebhook(body: Record<string, unknown>): AppointmentInput {
  const payload = firstRecord(body.payload, body.booking, body.data) ?? body;
  const eventType = firstString(body.triggerEvent, body.eventType, body.type, body.event);
  const attendees = firstArray(payload.attendees, payload.attendee, payload.guests);
  const attendee = firstRecord(attendees[0]);
  const organizer = firstRecord(payload.organizer, readNested(payload, ["eventType", "owner"]));
  const firstHost = firstRecord(firstArray(payload.hosts)[0]);

  return {
    source: "cal.com",
    sourceEventId: firstString(body.id, body.eventId, body.uid),
    sourceBookingId: firstString(payload.uid, payload.bookingUid, payload.id),
    status: appointmentStatusFromCal(eventType),
    service: firstString(
      readNested(payload, ["eventType", "title"]),
      payload.eventTitle,
      payload.title,
      payload.name,
    ),
    professional: firstString(firstHost?.name, organizer?.name, payload.userName),
    customerName: firstString(attendee?.name, payload.attendeeName, payload.name),
    customerEmail: firstString(attendee?.email, payload.attendeeEmail, payload.email),
    customerPhone: firstString(
      attendee?.phoneNumber,
      attendee?.phone,
      payload.attendeePhone,
      payload.phone,
    ),
    startsAt: firstString(payload.startTime, payload.start, payload.startsAt, payload.start_at),
    endsAt: firstString(payload.endTime, payload.end, payload.endsAt, payload.end_at),
    timezone: firstString(payload.timezone, payload.timeZone, attendee?.timeZone),
    notes: extractNotes(payload),
    payload: body,
  };
}

export async function upsertAppointment(input: AppointmentInput) {
  const row = await queryOne<AppointmentRow>(
    `
      insert into appointments (
        source,
        source_event_id,
        source_booking_id,
        status,
        service,
        professional,
        customer_name,
        customer_email,
        customer_phone,
        starts_at,
        ends_at,
        timezone,
        notes,
        payload
      )
      values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        nullif($10, '')::timestamptz,
        nullif($11, '')::timestamptz,
        $12, $13, $14::jsonb
      )
      on conflict (source_event_id) do update
      set
        source_booking_id = excluded.source_booking_id,
        status = excluded.status,
        service = excluded.service,
        professional = excluded.professional,
        customer_name = excluded.customer_name,
        customer_email = excluded.customer_email,
        customer_phone = excluded.customer_phone,
        starts_at = excluded.starts_at,
        ends_at = excluded.ends_at,
        timezone = excluded.timezone,
        notes = excluded.notes,
        payload = excluded.payload
      returning *
    `,
    [
      input.source,
      input.sourceEventId ?? null,
      input.sourceBookingId ?? null,
      input.status ?? "pending",
      input.service ?? null,
      input.professional ?? null,
      input.customerName ?? null,
      input.customerEmail ?? null,
      input.customerPhone ?? null,
      input.startsAt ?? null,
      input.endsAt ?? null,
      input.timezone ?? null,
      input.notes ?? null,
      JSON.stringify(input.payload),
    ],
  );

  if (!row) throw new Error("Appointment was not saved.");
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
