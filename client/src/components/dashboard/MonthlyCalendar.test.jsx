import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MonthlyCalendar from "./MonthlyCalendar.jsx";

describe("MonthlyCalendar", () => {
  it("renders an interactive monthly calendar", () => {
    // Arrange
    render(<MonthlyCalendar today={new Date("2026-05-18T12:00:00-07:00")} />);

    // Assert
    expect(
      screen.getByRole("heading", { name: /monthly schedule calendar/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/may 2026/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "18" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("moves between months", () => {
    // Arrange
    render(<MonthlyCalendar today={new Date("2026-05-18T12:00:00-07:00")} />);

    // Act
    fireEvent.click(screen.getByRole("button", { name: "→" }));

    // Assert
    expect(screen.getByText(/june 2026/i)).toBeInTheDocument();
  });

  it("shows events and reminders in the selected day detail", () => {
    // Arrange
    render(
      <MonthlyCalendar
        today={new Date("2026-05-18T12:00:00-07:00")}
        scheduleItems={[
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
    fireEvent.click(screen.getByRole("button", { name: /19/i }));

    const selectedDayDetail = screen.getByText(/tuesday, may 19/i)
      .parentElement;

    // Assert
    expect(
      within(selectedDayDetail).getByText(/project share/i),
    ).toBeInTheDocument();
    expect(
      within(selectedDayDetail).getByText(/submit weekly survey/i),
    ).toBeInTheDocument();
  });
});
