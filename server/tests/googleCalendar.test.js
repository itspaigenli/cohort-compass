import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatCalendarEvent,
  getGoogleCalendarScheduleItems,
} from "../src/lib/googleCalendar.js";

describe("googleCalendar", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.GOOGLE_CALENDAR_ID;
    delete process.env.GOOGLE_API_KEY;
    delete process.env.GOOGLE_CALENDAR_TIMEZONE;
    delete process.env.GOOGLE_CALENDAR_LOOKAHEAD_DAYS;
    delete process.env.GOOGLE_CALENDAR_MAX_RESULTS;
  });

  it("formats a Google Calendar event into a schedule item", () => {
    // Arrange
    const calendarEvent = {
      id: "event-1",
      summary: "Office Hours",
      description: "Debugging support",
      location: "Zoom",
      htmlLink: "https://calendar.google.com/event",
      start: { dateTime: "2026-05-20T18:00:00-07:00" },
      end: { dateTime: "2026-05-20T19:00:00-07:00" },
    };

    // Act
    const scheduleItem = formatCalendarEvent(calendarEvent);

    // Assert
    expect(scheduleItem).toEqual({
      id: "event-1",
      title: "Office Hours",
      description: "Debugging support",
      start_time: "2026-05-20T18:00:00-07:00",
      end_time: "2026-05-20T19:00:00-07:00",
      location: "Zoom",
      meeting_url: "https://calendar.google.com/event",
      recording_url: "",
      source: "google-calendar",
    });
  });

  it("returns null when Google Calendar environment variables are missing", async () => {
    // Act
    const scheduleItems = await getGoogleCalendarScheduleItems();

    // Assert
    expect(scheduleItems).toBeNull();
  });

  it("returns formatted calendar events when Google Calendar is configured", async () => {
    // Arrange
    process.env.GOOGLE_CALENDAR_ID = "calendar@example.com";
    process.env.GOOGLE_API_KEY = "test-api-key";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          {
            id: "event-1",
            summary: "Project Share",
            description: "Weekly project demo time",
            location: "Zoom",
            htmlLink: "https://calendar.google.com/event-1",
            start: { dateTime: "2026-05-22T17:00:00-07:00" },
            end: { dateTime: "2026-05-22T18:00:00-07:00" },
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    // Act
    const scheduleItems = await getGoogleCalendarScheduleItems();

    // Assert
    expect(scheduleItems).toHaveLength(1);
    expect(scheduleItems[0].title).toBe("Project Share");
    expect(scheduleItems[0].meeting_url).toBe(
      "https://calendar.google.com/event-1",
    );
  });

  it("requests upcoming single calendar events in start time order", async () => {
    // Arrange
    process.env.GOOGLE_CALENDAR_ID = "calendar@example.com";
    process.env.GOOGLE_API_KEY = "test-api-key";
    process.env.GOOGLE_CALENDAR_LOOKAHEAD_DAYS = "14";
    process.env.GOOGLE_CALENDAR_MAX_RESULTS = "25";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });

    vi.stubGlobal("fetch", fetchMock);

    // Act
    await getGoogleCalendarScheduleItems();

    // Assert
    const requestUrl = new URL(fetchMock.mock.calls[0][0]);

    expect(requestUrl.searchParams.get("singleEvents")).toBe("true");
    expect(requestUrl.searchParams.get("orderBy")).toBe("startTime");
    expect(requestUrl.searchParams.get("maxResults")).toBe("25");
    expect(requestUrl.searchParams.get("timeMin")).toBeTruthy();
    expect(requestUrl.searchParams.get("timeMax")).toBeTruthy();
  });

  it("sends the configured calendar timezone with the request", async () => {
    // Arrange
    process.env.GOOGLE_CALENDAR_ID = "calendar@example.com";
    process.env.GOOGLE_API_KEY = "test-api-key";
    process.env.GOOGLE_CALENDAR_TIMEZONE = "America/Los_Angeles";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });

    vi.stubGlobal("fetch", fetchMock);

    // Act
    await getGoogleCalendarScheduleItems();

    // Assert
    const requestUrl = new URL(fetchMock.mock.calls[0][0]);

    expect(requestUrl.searchParams.get("timeZone")).toBe(
      "America/Los_Angeles",
    );
  });
});
