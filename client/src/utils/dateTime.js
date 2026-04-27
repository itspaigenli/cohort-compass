import { format, parseISO } from "date-fns";
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

export function formatScheduleDateRange(startTime, endTime, timeZone = DEFAULT_TIME_ZONE) {
  if (isDateOnlyValue(startTime)) {
    return `${format(parseCalendarDate(startTime), "MMM d")} · All day`;
  }

  const start = formatInTimeZone(startTime, timeZone, "MMM d, h:mm a");

  if (!endTime) {
    return `${start} - End time TBD`;
  }

  const end = formatInTimeZone(endTime, timeZone, "MMM d, h:mm a");
  return `${start} - ${end}`;
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
    start_datetime_string: isDateOnlyValue(item.start_time)
      ? format(parseCalendarDate(item.start_time), "MMM d")
      : formatInTimeZone(item.start_time, timeZone, "MMM d, h:mm a"),
    date_and_duration_string: formatScheduleDateRange(item.start_time, item.end_time, timeZone),
    time_zone: timeZone,
  };
}

export function normalizeScheduleItems(items = [], timeZone = DEFAULT_TIME_ZONE) {
  return items.map((item) => normalizeScheduleItem(item, timeZone));
}
