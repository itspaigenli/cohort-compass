import { beforeEach, describe, expect, it, vi } from "vitest";
import { listSchedule } from "../src/controllers/scheduleController.js";
import { getGoogleCalendarScheduleItems } from "../src/lib/googleCalendar.js";
import { listScheduleItems } from "../src/models/scheduleModel.js";

vi.mock("../src/lib/googleCalendar.js", () => ({
  getGoogleCalendarScheduleItems: vi.fn(),
}));

vi.mock("../src/models/scheduleModel.js", () => ({
  listScheduleItems: vi.fn(),
}));

function createResponseMock() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe("listSchedule", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Google Calendar schedule items when they are available", async () => {
    // Arrange
    const response = createResponseMock();
    const calendarItems = [
      {
        id: "event-1",
        title: "Office Hours",
        start_time: "2026-05-20T18:00:00-07:00",
      },
    ];

    getGoogleCalendarScheduleItems.mockResolvedValue(calendarItems);

    // Act
    await listSchedule({ query: {} }, response);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ scheduleItems: calendarItems });
    expect(listScheduleItems).not.toHaveBeenCalled();
  });

  it("falls back to database schedule items when Google Calendar is unavailable", async () => {
    // Arrange
    const response = createResponseMock();
    const databaseItems = [
      {
        id: 1,
        title: "Weekly Check-In",
        start_time: "2026-05-21T17:00:00.000Z",
      },
    ];

    getGoogleCalendarScheduleItems.mockResolvedValue(null);
    listScheduleItems.mockResolvedValue(databaseItems);

    // Act
    await listSchedule({ query: {} }, response);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ scheduleItems: databaseItems });
  });
});
