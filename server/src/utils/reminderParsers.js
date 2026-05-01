export function parseReminderId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export function parseDueAt(value) {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: null };
  }

  if (typeof value !== "string") {
    return { ok: false };
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return { ok: false };
  }

  return { ok: true, value: parsed.toISOString() };
}
