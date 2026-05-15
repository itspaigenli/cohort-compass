import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MonthlyCalendar from "./MonthlyCalendar.jsx";

describe("MonthlyCalendar", () => {
  it("renders a simple monthly calendar", () => {
    // Arrange
    render(<MonthlyCalendar year={2026} monthIndex={4} />);

    // Act
    // No user action is needed because the calendar renders for the given month.

    // Assert
    expect(
      screen.getByRole("heading", { name: /may 2026/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();
  });
});
