import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SchedulePreview from "./SchedulePreview.jsx";

describe("SchedulePreview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-05T12:00:00.000Z"));
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders schedule items", () => {
    // Arrange
    render(
      <SchedulePreview
        items={[
          {
            id: 1,
            title: "Weekly Check-In",
            description:
              "<b>This is an asynchronous block of time.</b><br><br>Review your curriculum and prepare for milestones.",
            start_time: "2026-05-05T17:00:00.000Z",
            end_time: "2026-05-05T18:00:00.000Z",
            location: "https://zoom.us/j/example",
            meeting_url: "https://calendar.google.com/event",
          },
          {
            id: 2,
            title: "Tomorrow item",
            description: "Should not render in today's schedule.",
            start_time: "2026-05-06T17:00:00.000Z",
            end_time: "2026-05-06T18:00:00.000Z",
          },
        ]}
      />,
    );

    // Act
    // No user action is needed because the schedule renders from props.

    // Assert
    expect(screen.getByRole("heading", { name: "Two-day snapshot" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Today · Tuesday May 5" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tomorrow · Wednesday May 6" })).toBeInTheDocument();
    expect(screen.getByText("Weekly Check-In")).toBeInTheDocument();
    expect(screen.getByText("Tomorrow item")).toBeInTheDocument();
    expect(screen.getByText("Zoom")).toBeInTheDocument();
    expect(screen.queryByText(/This is an asynchronous block of time/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View in Google Calendar" })).toHaveAttribute(
      "href",
      "https://calendar.google.com/event",
    );
  });

  it("shows an empty state when there are no events today", () => {
    // Arrange
    render(
      <SchedulePreview
        items={[
          {
            id: 2,
            title: "Tomorrow item",
            description: "Should not render in today's schedule.",
            start_time: "2026-05-06T17:00:00.000Z",
            end_time: "2026-05-06T18:00:00.000Z",
          },
        ]}
      />,
    );

    // Act
    // No user action is needed because the day has no matching items.

    // Assert
    expect(screen.getByText("No events on this day's calendar.")).toBeInTheDocument();
  });

  it("lets the user move forward and backward by two-day windows", () => {
    // Arrange
    render(
      <SchedulePreview
        items={[
          {
            id: 1,
            title: "Today item",
            description: "Today's event",
            start_time: "2026-05-05T17:00:00.000Z",
            end_time: "2026-05-05T18:00:00.000Z",
          },
          {
            id: 2,
            title: "Tomorrow item",
            description: "Tomorrow's event",
            start_time: "2026-05-06T17:00:00.000Z",
            end_time: "2026-05-06T18:00:00.000Z",
          },
          {
            id: 3,
            title: "Day after tomorrow item",
            description: "Later event",
            start_time: "2026-05-07T17:00:00.000Z",
            end_time: "2026-05-07T18:00:00.000Z",
          },
          {
            id: 4,
            title: "Two days ahead item",
            description: "Window shift event",
            start_time: "2026-05-08T17:00:00.000Z",
            end_time: "2026-05-08T18:00:00.000Z",
          },
        ]}
      />,
    );

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Next days" }));

    // Assert
    expect(screen.getByRole("heading", { name: "Two-day snapshot" })).toBeInTheDocument();
    expect(screen.getByText("Day after tomorrow item")).toBeInTheDocument();
    expect(screen.getByText("Two days ahead item")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Thursday May 7" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Friday May 8" })).toBeInTheDocument();
    expect(screen.queryByText("Today item")).not.toBeInTheDocument();
    expect(screen.queryByText("Tomorrow item")).not.toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Previous days" }));

    // Assert
    expect(screen.getByRole("heading", { name: "Two-day snapshot" })).toBeInTheDocument();
    expect(screen.getByText("Today item")).toBeInTheDocument();
  });

  it("treats date-only events as local calendar days", () => {
    // Arrange
    render(
      <SchedulePreview
        items={[
          {
            id: 3,
            title: "All day cohort work",
            start_time: "2026-05-06",
            end_time: "2026-05-07",
          },
        ]}
      />,
    );

    // Act
    // No user action is needed because the all-day item renders from props.

    // Assert
    expect(screen.getByText("All day cohort work")).toBeInTheDocument();
    expect(screen.getByText("May 6 · All day")).toBeInTheDocument();
  });

  it("loads schedule items for the selected day from the server callback", async () => {
    // Arrange
    vi.useRealTimers();

    const onLoadItemsForDate = vi.fn(async ({ date }) => {
      let title = "Fetched current day item";

      if (onLoadItemsForDate.mock.calls.length === 2) {
        title = "Fetched next day item";
      }

      if (onLoadItemsForDate.mock.calls.length > 2) {
        title = "Fetched later day item";
      }

      return [
        {
          id: title,
          title,
          start_time: `${date}T17:00:00-07:00`,
          end_time: `${date}T18:00:00-07:00`,
        },
      ];
    });

    render(<SchedulePreview items={[]} onLoadItemsForDate={onLoadItemsForDate} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Fetched current day item")).toBeInTheDocument();
    });
    expect(screen.getByText("Fetched next day item")).toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Next days" }));

    // Assert
    await waitFor(() => {
      expect(screen.getAllByText("Fetched later day item")).toHaveLength(2);
    });

    expect(onLoadItemsForDate).toHaveBeenCalledTimes(4);
  });

  it("shows one day at a time on mobile and advances by one day", () => {
    // Arrange
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(max-width: 960px)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <SchedulePreview
        items={[
          {
            id: 1,
            title: "Today item",
            start_time: "2026-05-05T17:00:00.000Z",
            end_time: "2026-05-05T18:00:00.000Z",
          },
          {
            id: 2,
            title: "Tomorrow item",
            start_time: "2026-05-06T17:00:00.000Z",
            end_time: "2026-05-06T18:00:00.000Z",
          },
        ]}
      />,
    );

    // Assert
    expect(screen.getByRole("heading", { name: "Day snapshot" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Today · Tuesday May 5" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Tomorrow · Wednesday May 6" })).not.toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Next days" }));

    // Assert
    expect(screen.getByRole("heading", { name: "Wednesday May 6" })).toBeInTheDocument();
    expect(screen.getByText("Tomorrow item")).toBeInTheDocument();
  });
});
