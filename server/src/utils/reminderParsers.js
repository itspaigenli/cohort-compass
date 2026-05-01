import { isValid, parseISO } from "date-fns";

export function parseReminderId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

const ISO_TIMESTAMP_WITH_TIMEZONE_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

export function parseDueAt(value) {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: null };
  }

  if (typeof value !== "string") {
    return { ok: false };
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
