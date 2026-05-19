import { isValid, parseISO } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export function parseReminderId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

const ISO_TIMESTAMP_WITH_TIMEZONE_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;
const CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const LOCAL_DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const DEFAULT_TIME_ZONE = process.env.GOOGLE_CALENDAR_TIMEZONE || "America/Los_Angeles";

function isRealCalendarDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function toUtcIso(value) {
  const utcDate = fromZonedTime(value, DEFAULT_TIME_ZONE);

  if (!isValid(utcDate)) {
    return null;
  }

  return utcDate.toISOString();
}

export function parseDueAt(value) {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: null };
  }

  if (typeof value !== "string") {
    return { ok: false };
  }

  if (CALENDAR_DATE_PATTERN.test(value)) {
    if (!isRealCalendarDate(value)) {
      return { ok: false };
    }

    return { ok: true, value: toUtcIso(`${value}T00:00:00`) };
  }

  if (LOCAL_DATE_TIME_PATTERN.test(value)) {
    const [datePart] = value.split("T");
    const isoDate = toUtcIso(value);

    if (!isRealCalendarDate(datePart) || !isoDate) {
      return { ok: false };
    }

    return { ok: true, value: isoDate };
  }

  if (!ISO_TIMESTAMP_WITH_TIMEZONE_PATTERN.test(value)) {
    return { ok: false };
  }

  const parsed = parseISO(value);

  if (!isValid(parsed)) {
    return { ok: false };
  }

  return { ok: true, value: parsed.toISOString() };
}
