import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardPage from "./DashboardPage.jsx";

vi.mock("../components/dashboard/SchedulePreview.jsx", () => ({
  default: ({ scheduleItems = [] }) => (
    <p>Schedule preview received {scheduleItems.length} schedule item</p>
  ),
}));

vi.mock("../components/dashboard/MonthlyCalendar.jsx", () => ({
  default: ({ scheduleItems = [] }) => (
    <p>Monthly calendar received {scheduleItems.length} schedule item</p>
  ),
}));

vi.mock("../components/dashboard/RemindersPanel.jsx", () => ({
  default: () => <p>Reminders preview test content</p>,
}));

describe("DashboardPage", () => {
  it("renders the mock-final style dashboard sections", () => {
    // Arrange
    render(<DashboardPage />);

    // Act
    // No user action is needed because the dashboard renders on page load.

    // Assert
    expect(
      screen.getByRole("heading", { name: /cohort compass/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /reminder list/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /plan your week/i }),
    ).toBeInTheDocument();
  });

  it("renders the dashboard hero search form", () => {
    // Arrange
    render(<DashboardPage />);

    // Act
    // No user action is needed because the search link renders on page load.

    // Assert
    expect(
      screen.getByRole("searchbox", {
        name: /search docs, tools, debugging help, or a topic/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /search student hub/i }),
    ).toBeInTheDocument();
  });

  it("renders the monthly calendar on the dashboard", async () => {
    // Arrange
    render(
      <DashboardPage
        scheduleItems={[
          {
            id: 1,
            title: "Project Share",
            start_time: "2026-05-15T19:30:00.000Z",
          },
        ]}
      />,
    );

    // Act
    // No user action is needed because the calendar renders with the dashboard.

    // Assert
    expect(
      await screen.findByText(/monthly calendar received 1 schedule item/i),
    ).toBeInTheDocument();
  });
});
