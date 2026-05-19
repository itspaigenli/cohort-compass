import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SchedulePreview from "./SchedulePreview.jsx";

describe("SchedulePreview", () => {
  it("renders the two-day schedule snapshot", () => {
    // Arrange
    const scheduleItems = [
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
    ];

    // Act
    render(
      <SchedulePreview
        scheduleItems={scheduleItems}
        today={new Date("2026-05-18T12:00:00-07:00")}
      />,
    );

    // Assert
    expect(
      screen.getByRole("heading", { name: /two-day snapshot/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/today · monday, may 18/i)).toBeInTheDocument();
    expect(screen.getByText(/tomorrow · tuesday, may 19/i)).toBeInTheDocument();
    expect(screen.getByText(/career workshop/i)).toBeInTheDocument();
    expect(
      screen.getByText(/showing events from google calendar/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/may 18, 10:00 am/i)).toBeInTheDocument();
    expect(screen.getByText(/zoom/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view in google calendar/i }),
    ).toHaveAttribute("href", "https://calendar.google.com/event");
  });

  it("renders empty day messages when no schedule items are provided", () => {
    // Act
    render(<SchedulePreview today={new Date("2026-05-18T12:00:00-07:00")} />);

    // Assert
    const emptyMessages = screen.getAllByText(
      /no events on this day's calendar/i,
    );

    expect(emptyMessages).toHaveLength(2);
  });
});
