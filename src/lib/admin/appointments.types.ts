export const APPOINTMENT_STATUSES = [
  "pending",
  "confirmed",
  "reschedule",
  "cancelled",
  "completed",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export type AppointmentRecord = {
  id: string;
  source: string;
  sourceEventId: string | null;
  sourceBookingId: string | null;
  status: AppointmentStatus;
  serviceId: string | null;
  professionalId: string | null;
  service: string | null;
  professional: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  startsAt: string | null;
  endsAt: string | null;
  durationMinutes: number | null;
  timezone: string | null;
  notes: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  googleCalendarUrl: string | null;
  events: AppointmentEventRecord[];
};

export type AppointmentEventRecord = {
  id: string;
  type: string;
  actor: string;
  message: string;
  payload: Record<string, unknown>;
  createdAt: string;
};
