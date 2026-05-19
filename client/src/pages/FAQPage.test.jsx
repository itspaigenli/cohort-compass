import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FAQPage from "./FAQPage.jsx";

vi.mock("../components/dashboard/FaqPreview.jsx", () => ({
  default: ({ faqEntries = [] }) => (
    <p>FAQ preview received {faqEntries.length} FAQ entry</p>
  ),
}));

describe("FAQPage", () => {
  it("renders the FAQ page shell", () => {
    // Arrange
    render(
      <FAQPage
        faqEntries={[
          {
            id: 1,
            question: "Why is my fetch failing?",
            answer: "Check the server.",
          },
        ]}
      />,
    );

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
    render(
      <FAQPage
        faqEntries={[
          {
            id: 1,
            question: "Why is my fetch failing?",
            answer: "Check the server.",
          },
        ]}
      />,
    );

    // Act
    // No user action is needed because the FAQ entries load with the page.

    // Assert
    expect(
      screen.getByText(/faq preview received 1 faq entry/i),
    ).toBeInTheDocument();
  });
});
