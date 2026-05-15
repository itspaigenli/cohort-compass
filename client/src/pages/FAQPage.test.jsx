import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FAQPage from "./FAQPage.jsx";

vi.mock("../components/dashboard/FaqPreview.jsx", () => ({
  default: () => <p>FAQ entries test content</p>,
}));

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

  it("shows FAQ entries on the FAQ page", () => {
    // Arrange
    render(<FAQPage />);

    // Act
    // No user action is needed because the FAQ entries load with the page.

    // Assert
    expect(screen.getByText(/faq entries test content/i)).toBeInTheDocument();
  });
});
