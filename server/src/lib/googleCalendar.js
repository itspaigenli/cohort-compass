import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3/calendars";
const DEFAULT_TIME_ZONE = "America/Los_Angeles";

function getTimeZone() {
  return process.env.GOOGLE_CALENDAR_TIMEZONE || DEFAULT_TIME_ZONE;
}

function getDayRange(dateValue, timeZone = DEFAULT_TIME_ZONE) {
  const baseDate = typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ? new Date(`${dateValue}T12:00:00Z`)
    : new Date(dateValue);

  if (Number.isNaN(baseDate.getTime())) {
    return null;
  }

  const dayString = typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ? dateValue
    : formatInTimeZone(baseDate, timeZone, "yyyy-MM-dd");

  return {
    timeMin: fromZonedTime(`${dayString}T00:00:00`, timeZone).toISOString(),
    timeMax: fromZonedTime(`${dayString}T23:59:59`, timeZone).toISOString(),
  };
}

function getLookaheadEndTime(timeZone) {
  const lookaheadDays = Number(process.env.GOOGLE_CALENDAR_LOOKAHEAD_DAYS || "30");
  const zonedEndTime = toZonedTime(new Date(), timeZone);

  zonedEndTime.setDate(zonedEndTime.getDate() + lookaheadDays);

  return fromZonedTime(zonedEndTime, timeZone).toISOString();
}

function getMaxResults() {
  return process.env.GOOGLE_CALENDAR_MAX_RESULTS || "100";
}

function getCalendarConfig() {
  return {
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    apiKey: process.env.GOOGLE_API_KEY,
  };
}

export function formatCalendarEvent(event) {
  const startTime = event.start?.dateTime || event.start?.date || null;
  const endTime = event.end?.dateTime || event.end?.date || null;

  return {
    id: event.id,
    title: event.summary || "Untitled event",
    description: event.description || "",
    start_time: startTime,
    end_time: endTime,
    location: event.location || "",
    meeting_url: event.htmlLink || "",
    recording_url: "",
    source: "google-calendar",
  };
}

export async function getGoogleCalendarScheduleItems(options = {}) {
  const { calendarId, apiKey } = getCalendarConfig();
  const timeZone = getTimeZone();

  if (!calendarId || !apiKey) {
    return null;
  }

  const url = new URL(
    `${GOOGLE_CALENDAR_API_BASE}/${encodeURIComponent(calendarId)}/events`,
  );

  const dayRange = options.date ? getDayRange(options.date, timeZone) : null;

  url.searchParams.set("key", apiKey);
  url.searchParams.set("timeMin", dayRange?.timeMin || new Date().toISOString());
  url.searchParams.set("timeMax", dayRange?.timeMax || getLookaheadEndTime(timeZone));
  url.searchParams.set("maxResults", dayRange ? "25" : getMaxResults());
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("timeZone", timeZone);

  let response;

  try {
    response = await fetch(url);
  } catch {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return (data.items || []).map(formatCalendarEvent);
}
