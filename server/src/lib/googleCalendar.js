const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3/calendars";

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

export async function getGoogleCalendarScheduleItems() {
  const { calendarId, apiKey } = getCalendarConfig();

  if (!calendarId || !apiKey) {
    return null;
  }

  const url = new URL(
    `${GOOGLE_CALENDAR_API_BASE}/${encodeURIComponent(calendarId)}/events`,
  );

  url.searchParams.set("key", apiKey);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");

  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return (data.items || []).map(formatCalendarEvent);
}
