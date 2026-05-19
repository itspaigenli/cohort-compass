import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SchedulePreview from "./SchedulePreview.jsx";
import { fetchScheduleItems } from "../../services/scheduleApi.js";

vi.mock("../../services/scheduleApi.js", () => ({
  fetchScheduleItems: vi.fn(),
}));

describe("SchedulePreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the two-day schedule snapshot from the API", async () => {
    // Arrange
    fetchScheduleItems.mockResolvedValue([
      {
        id: 1,
        title: "Career workshop",
        start_time: "2026-05-18T17:00:00.000Z",
        end_time: "2026-05-18T18:00:00.000Z",
        date_and_duration_string: "May 18, 10:00 AM - May 18, 11:00 AM",
        location: "Zoom",
        meeting_url: "https://calendar.google.com/event",
        source: "google-calendar",
      },
    ]);

    // Act
    render(<SchedulePreview today={new Date("2026-05-18T12:00:00-07:00")} />);

    // Assert
    expect(screen.getByText(/loading schedule/i)).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: /two-day snapshot/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/today · monday, may 18/i)).toBeInTheDocument();
    expect(screen.getByText(/tomorrow · tuesday, may 19/i)).toBeInTheDocument();
    expect(await screen.findByText(/career workshop/i)).toBeInTheDocument();
    expect(
      screen.getByText(/showing events from google calendar/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/may 18, 10:00 am/i)).toBeInTheDocument();
    expect(screen.getByText(/zoom/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view in google calendar/i }),
    ).toHaveAttribute("href", "https://calendar.google.com/event");
  });

  it("renders empty day messages when no schedule items are returned", async () => {
    // Arrange
    fetchScheduleItems.mockResolvedValue([]);

    // Act
    render(<SchedulePreview today={new Date("2026-05-18T12:00:00-07:00")} />);

    // Assert
    const emptyMessages = await screen.findAllByText(
      /no events on this day's calendar/i,
    );

    expect(emptyMessages).toHaveLength(2);
  });

  it("renders an error message when the API request fails", async () => {
    // Arrange
    fetchScheduleItems.mockRejectedValue(new Error("Schedule request failed"));

    // Act
    render(<SchedulePreview />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/schedule request failed/i)).toBeInTheDocument();
    });
  });
});
