import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App.jsx";

vi.mock("./components/dashboard/SchedulePreview.jsx", () => ({
  default: () => <p>Schedule preview test content</p>,
}));

vi.mock("./components/dashboard/LinksPreview.jsx", () => ({
  default: () => <p>Links preview test content</p>,
}));

vi.mock("./components/dashboard/FaqPreview.jsx", () => ({
  default: () => <p>FAQ preview test content</p>,
}));

vi.mock("./components/dashboard/RemindersPanel.jsx", () => ({
  default: () => <p>Reminders preview test content</p>,
}));

describe("App", () => {
  it("renders the homepage shell with the main dashboard sections", () => {
    // Arrange
    render(<App />);

    // Act
    // No user action is needed because the homepage shell renders on page load.

    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /cohort compass/i }),
    ).toBeInTheDocument();
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

  it("renders the main homepage navigation links", () => {
    // Arrange
    render(<App />);

    const navigation = screen.getByRole("navigation", {
      name: /main sections/i,
    });

    // Act
    // No user action is needed because the navigation renders on page load.

    // Assert
    expect(navigation).toBeInTheDocument();
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

  it("renders the quick-find homepage shortcuts", () => {
    // Arrange
    render(<App />);

    // Act
    // No user action is needed because the shortcuts render on page load.

    // Assert
    expect(
      screen.getByRole("heading", { name: /what are you looking for/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /today's schedule/i }),
    ).toHaveAttribute("href", "#schedule");
    expect(
      screen.getByRole("link", { name: /program links/i }),
    ).toHaveAttribute("href", "#links");
    expect(
      screen.getByRole("link", { name: /debugging help/i }),
    ).toHaveAttribute("href", "#faq");
    expect(
      screen.getByRole("link", { name: /my reminders/i }),
    ).toHaveAttribute("href", "#reminders");
  });
});
