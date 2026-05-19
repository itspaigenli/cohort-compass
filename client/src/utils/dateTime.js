import { addDays as addDateFnsDays, format, isSameDay, parseISO, startOfDay } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const DEFAULT_TIME_ZONE =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

export function isDateOnlyValue(value = "") {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function parseCalendarDate(value) {
  if (isDateOnlyValue(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return parseISO(value);
}

export function startOfLocalDay(date = new Date()) {
  return startOfDay(date);
}

export function addDays(date, amount) {
  return startOfDay(addDateFnsDays(date, amount));
}

export function toDateKey(date) {
  return format(date, "yyyy-MM-dd");
}

export function toDateKeyInTimeZone(value, timeZone = DEFAULT_TIME_ZONE) {
  if (isDateOnlyValue(value)) {
    return value;
  }

  return formatInTimeZone(value, timeZone, "yyyy-MM-dd");
}

export function isSameCalendarDay(value, referenceDate = new Date(), timeZone = DEFAULT_TIME_ZONE) {
  if (value instanceof Date) {
    return isSameDay(value, referenceDate);
  }

  return toDateKeyInTimeZone(value, timeZone) === toDateKey(referenceDate);
}

export function formatDayLabel(date = new Date()) {
  return format(date, "EEEE MMM d");
}

export function formatMonthYear(date = new Date()) {
  return format(date, "MMMM yyyy");
}

export function formatMobileDetailDate(date = new Date()) {
  return format(date, "EEEE, MMM d");
}

export function formatScheduleDateRange(startTime, endTime, timeZone = DEFAULT_TIME_ZONE) {
  if (isDateOnlyValue(startTime)) {
    return `${format(parseCalendarDate(startTime), "MMM d")} · All day`;
  }

  const start = formatInTimeZone(startTime, timeZone, "MMM d, h:mm a");

  if (!endTime) {
    return start;
  }

  const end = formatInTimeZone(endTime, timeZone, "h:mm a");
  return `${start} - ${end}`;
}

export function formatTimeRange(startTime, endTime, timeZone = DEFAULT_TIME_ZONE) {
  if (isDateOnlyValue(startTime)) {
    return "All day";
  }

  const start = formatInTimeZone(startTime, timeZone, "h:mm a");

  if (!endTime) {
    return start;
  }

  const end = formatInTimeZone(endTime, timeZone, "h:mm a");
  return `${start} - ${end}`;
}

export function formatOptionalTime(value, timeZone = DEFAULT_TIME_ZONE) {
  if (!value || isDateOnlyValue(value)) {
    return "";
  }

  const parsedDate = parseCalendarDate(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return formatInTimeZone(value, timeZone, "h:mm a");
}

export function formatReminderDueDate(value, timeZone = DEFAULT_TIME_ZONE) {
  if (!value) {
    return "";
  }

  const parsedDate = parseCalendarDate(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  if (isDateOnlyValue(value)) {
    return format(parsedDate, "MMM d");
  }

  return formatInTimeZone(value, timeZone, "MMM d, h:mm a");
}

export function normalizeScheduleItem(item, timeZone = DEFAULT_TIME_ZONE) {
  const startDateTime = item.start_time && !isDateOnlyValue(item.start_time)
    ? toZonedTime(item.start_time, timeZone)
    : parseCalendarDate(item.start_time);
  const endDateTime = item.end_time && !isDateOnlyValue(item.end_time)
    ? toZonedTime(item.end_time, timeZone)
    : item.end_time
      ? parseCalendarDate(item.end_time)
      : null;

  return {
    ...item,
    start_datetime: startDateTime,
    end_datetime: endDateTime,
    start_date_key: toDateKeyInTimeZone(item.start_time, timeZone),
    end_date_key: item.end_time ? toDateKeyInTimeZone(item.end_time, timeZone) : "",
    start_datetime_string: isDateOnlyValue(item.start_time)
      ? format(parseCalendarDate(item.start_time), "MMM d")
      : formatInTimeZone(item.start_time, timeZone, "MMM d, h:mm a"),
    date_and_duration_string: formatScheduleDateRange(item.start_time, item.end_time, timeZone),
    time_range_string: formatTimeRange(item.start_time, item.end_time, timeZone),
    time_zone: timeZone,
  };
}

export function normalizeScheduleItems(items = [], timeZone = DEFAULT_TIME_ZONE) {
  return items.map((item) => normalizeScheduleItem(item, timeZone));
}
