export const BOOKING_TIMEZONE = "Europe/Lisbon";
export const BOOKING_SLOT_INTERVAL_MINUTES = 30;

export type BookingBusinessHours = {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

const CLOSED_HOURS: BookingBusinessHours = {
  isOpen: false,
  openTime: "09:00",
  closeTime: "19:00",
};

export const BOOKING_WEEKLY_HOURS: Record<string, BookingBusinessHours> = {
  Mon: { isOpen: true, openTime: "09:00", closeTime: "19:00" },
  Tue: { isOpen: true, openTime: "09:00", closeTime: "19:00" },
  Wed: { isOpen: true, openTime: "09:00", closeTime: "19:00" },
  Thu: { isOpen: true, openTime: "09:00", closeTime: "19:00" },
  Fri: { isOpen: true, openTime: "09:00", closeTime: "19:00" },
  Sat: { isOpen: true, openTime: "09:00", closeTime: "19:00" },
  Sun: CLOSED_HOURS,
};

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

export function validateDurationMinutes(duration: number) {
  if (!Number.isFinite(duration) || duration < 15 || duration > 8 * 60) {
    throw new Error("Duração do serviço inválida.");
  }

  return duration;
}

export function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function formatMinutes(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
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

export function makeZonedDate(date: string, time: string, timeZone = BOOKING_TIMEZONE) {
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

export function getLisbonWeekday(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIMEZONE,
    weekday: "short",
  }).format(date);
}

export function getBookingBusinessHours(date: string | Date) {
  const zonedDate =
    typeof date === "string" ? (isValidIsoDate(date) ? makeZonedDate(date, "12:00") : null) : date;

  if (!zonedDate) return CLOSED_HOURS;

  const weekday = getLisbonWeekday(zonedDate);
  return BOOKING_WEEKLY_HOURS[weekday] ?? CLOSED_HOURS;
}

export function isWithinBusinessHours(
  startTime: string,
  durationMinutes: number,
  businessHours: BookingBusinessHours,
) {
  if (!businessHours.isOpen) return false;

  const startMinutes = toMinutes(startTime);
  const endMinutes = startMinutes + durationMinutes;

  return (
    startMinutes >= toMinutes(businessHours.openTime) &&
    endMinutes <= toMinutes(businessHours.closeTime)
  );
}

export function generateBookingTimesForDuration(
  durationMinutes: number,
  businessHours: BookingBusinessHours,
  intervalMinutes = BOOKING_SLOT_INTERVAL_MINUTES,
) {
  if (!businessHours.isOpen) return [];

  const openMinutes = toMinutes(businessHours.openTime);
  const closeMinutes = toMinutes(businessHours.closeTime);
  const times: string[] = [];

  for (let minutes = openMinutes; minutes < closeMinutes; minutes += intervalMinutes) {
    const time = formatMinutes(minutes);
    if (isWithinBusinessHours(time, durationMinutes, businessHours)) {
      times.push(time);
    }
  }

  return times;
}

export function hasIntervalOverlap(
  newStart: number,
  newEnd: number,
  existingStart: number,
  existingEnd: number,
) {
  return newStart < existingEnd && newEnd > existingStart;
}
