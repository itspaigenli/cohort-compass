import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FAQPage from "./FAQPage.jsx";

describe("FAQPage", () => {
  it("renders the FAQ page shell", () => {
    // Arrange
    render(<FAQPage />);

    // Act
    // No user action is needed because the FAQ page shell renders on page load.

    // Assert
    expect(
      screen.getByRole("heading", { name: /debugging faq/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/common debugging questions/i)).toBeInTheDocument();
  });
});
