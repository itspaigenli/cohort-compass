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

  it("renders schedule items from the API", async () => {
    // Arrange
    fetchScheduleItems.mockResolvedValue([
      {
        id: 1,
        title: "Career workshop",
        description: "Practice interview questions with the cohort.",
        date_and_duration_string: "May 7, 10:00 AM - May 7, 11:00 AM",
        location: "Zoom",
        meeting_url: "https://example.com/meeting",
      },
    ]);

    // Act
    render(<SchedulePreview />);

    // Assert
    expect(screen.getByText(/loading schedule/i)).toBeInTheDocument();
    expect(await screen.findByText(/career workshop/i)).toBeInTheDocument();
    expect(
      screen.getByText(/practice interview questions/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/when:/i)).toBeInTheDocument();
    expect(screen.getByText(/may 7, 10:00 am/i)).toBeInTheDocument();
    expect(screen.getByText(/where:/i)).toBeInTheDocument();
    expect(screen.getByText(/zoom/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open meeting/i })).toHaveAttribute(
      "href",
      "https://example.com/meeting",
    );
  });

  it("renders an empty message when no schedule items are returned", async () => {
    // Arrange
    fetchScheduleItems.mockResolvedValue([]);

    // Act
    render(<SchedulePreview />);

    // Assert
    expect(
      await screen.findByText(/no upcoming schedule items yet/i),
    ).toBeInTheDocument();
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
