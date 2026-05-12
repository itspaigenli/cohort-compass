import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App.jsx";

vi.mock("./pages/DashboardPage.jsx", () => ({
  default: () => <p>Dashboard page test content</p>,
}));

vi.mock("./pages/SearchPage.jsx", () => ({
  default: () => <p>Search page test content</p>,
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

  it("renders the search page when the hash is search", () => {
    // Arrange
    window.location.hash = "#search";

    // Act
    render(<App />);

    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText(/search page test content/i)).toBeInTheDocument();
  });
});
