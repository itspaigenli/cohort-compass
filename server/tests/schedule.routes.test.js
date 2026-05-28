import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/index.js";
import { getGoogleCalendarScheduleItems } from "../src/lib/googleCalendar.js";
import { listScheduleItems } from "../src/models/scheduleModel.js";

vi.mock("../src/lib/googleCalendar.js", () => ({
  getGoogleCalendarScheduleItems: vi.fn(),
}));

vi.mock("../src/models/scheduleModel.js", () => ({
  listScheduleItems: vi.fn(),
}));

describe("GET /api/schedule", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns schedule items from Google Calendar when available", async () => {
    // Arrange
    const scheduleItems = [
      {
        id: "event-1",
        title: "Core Skills",
        start_time: "2026-05-20T17:00:00-07:00",
      },
    ];

    getGoogleCalendarScheduleItems.mockResolvedValue(scheduleItems);

    // Act
    const response = await request(app).get("/api/schedule?date=2026-05-20");

    // Assert
    expect(response.status).toBe(200);
    expect(getGoogleCalendarScheduleItems).toHaveBeenCalledWith({
      date: "2026-05-20",
    });
    expect(response.body).toEqual({ scheduleItems });
  });

  it("uses database schedule items when Google Calendar is unavailable", async () => {
    // Arrange
    const scheduleItems = [
      {
        id: 1,
        title: "Weekly Check-In",
        start_time: "2026-05-20T17:00:00.000Z",
      },
    ];

    getGoogleCalendarScheduleItems.mockResolvedValue(null);
    listScheduleItems.mockResolvedValue(scheduleItems);

    // Act
    const response = await request(app).get("/api/schedule");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ scheduleItems });
  });

  it("returns an error when the date filter is not YYYY-MM-DD", async () => {
    // Act
    const response = await request(app).get("/api/schedule?date=05-20-2026");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Date must use YYYY-MM-DD format." });
    expect(getGoogleCalendarScheduleItems).not.toHaveBeenCalled();
    expect(listScheduleItems).not.toHaveBeenCalled();
  });
});
