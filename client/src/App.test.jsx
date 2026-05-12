import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App.jsx";

vi.mock("./pages/DashboardPage.jsx", () => ({
  default: () => <p>Dashboard page test content</p>,
}));

describe("App", () => {
  it("renders the dashboard page inside the app shell", () => {
    // Arrange
    render(<App />);

    // Act
    // No user action is needed because the app shell renders on page load.

    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText(/dashboard page test content/i)).toBeInTheDocument();
  });
});
