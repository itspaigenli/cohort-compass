import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardPage from "./DashboardPage.jsx";

vi.mock("../components/dashboard/SchedulePreview.jsx", () => ({
  default: ({ onScheduleItemsLoaded }) => {
    onScheduleItemsLoaded?.([
      {
        id: 1,
        title: "Project Share",
        start_time: "2026-05-15T19:30:00.000Z",
      },
    ]);

    return <p>Schedule preview test content</p>;
  },
}));

vi.mock("../components/dashboard/MonthlyCalendar.jsx", () => ({
  default: ({ scheduleItems = [] }) => (
    <p>Monthly calendar received {scheduleItems.length} schedule item</p>
  ),
}));

vi.mock("../components/dashboard/LinksPreview.jsx", () => ({
  default: () => <p>Links preview test content</p>,
}));

vi.mock("../components/dashboard/FaqPreview.jsx", () => ({
  default: () => <p>FAQ preview test content</p>,
}));

vi.mock("../components/dashboard/RemindersPanel.jsx", () => ({
  default: () => <p>Reminders preview test content</p>,
}));

describe("DashboardPage", () => {
  it("renders the homepage section navigation", () => {
    // Arrange
    render(<DashboardPage />);

    const navigation = screen.getByRole("navigation", {
      name: /main sections/i,
    });

    // Act
    // No user action is needed because the navigation renders on page load.

    // Assert
    expect(
      within(navigation).getByRole("link", { name: /schedule/i }),
    ).toHaveAttribute("href", "#schedule");
    expect(
      within(navigation).getByRole("link", { name: /links/i }),
    ).toHaveAttribute("href", "#links");
    expect(
      within(navigation).getByRole("link", { name: /faq/i }),
    ).toHaveAttribute("href", "#faq");
    expect(
      within(navigation).getByRole("link", { name: /reminders/i }),
    ).toHaveAttribute("href", "#reminders");
  });

  it("renders the dashboard section headings", () => {
    // Arrange
    render(<DashboardPage />);

    // Act
    // No user action is needed because the dashboard sections render on page load.

    // Assert
    expect(
      screen.getByRole("heading", { name: /upcoming schedule/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /important links/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /debugging faq/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /^reminders$/i }),
    ).toBeInTheDocument();
  });

  it("links to the search page from the homepage", () => {
    // Arrange
    render(<DashboardPage />);

    // Act
    // No user action is needed because the search link renders on page load.

    // Assert
    expect(
      screen.getByRole("link", { name: /search student hub/i }),
    ).toHaveAttribute("href", "#search");
  });

  it("renders the monthly calendar on the dashboard", () => {
    // Arrange
    render(<DashboardPage />);

    // Act
    // No user action is needed because the calendar renders with the dashboard.

    // Assert
    expect(
      screen.getByText(/monthly calendar received 1 schedule item/i),
    ).toBeInTheDocument();
  });
});
