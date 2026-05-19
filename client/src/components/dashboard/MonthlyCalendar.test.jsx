import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MonthlyCalendar from "./MonthlyCalendar.jsx";

describe("MonthlyCalendar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-18T12:00:00-07:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders an interactive monthly calendar", () => {
    // Arrange
    render(<MonthlyCalendar />);

    // Act
    // No user action is needed because the current month renders immediately.

    // Assert
    expect(screen.getByText(/may 2026/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "18" })).toHaveClass("today");
  });

  it("moves between months", () => {
    // Arrange
    render(<MonthlyCalendar />);

    // Act
    fireEvent.click(screen.getByRole("button", { name: /next month/i }));

    // Assert
    expect(screen.getByText(/june 2026/i)).toBeInTheDocument();
  });

  it("shows events and reminders on matching calendar days", () => {
    // Arrange
    render(
      <MonthlyCalendar
        items={[
          {
            id: 1,
            title: "Project Share",
            start_time: "2026-05-19T17:00:00-07:00",
            end_time: "2026-05-19T18:00:00-07:00",
            date_and_duration_string: "May 19, 5:00 PM - May 19, 6:00 PM",
            meeting_url: "https://calendar.google.com/event",
          },
        ]}
        reminders={[
          {
            id: 2,
            text: "Submit weekly survey",
            due_at: "2026-05-19",
            done: false,
          },
        ]}
      />,
    );

    // Act
    // No user action is needed because matching items render in the month grid.

    // Assert
    expect(screen.getByRole("link", { name: /1 event/i })).toBeInTheDocument();
    expect(screen.getByText(/submit weekly survey/i)).toBeInTheDocument();
  });
});
