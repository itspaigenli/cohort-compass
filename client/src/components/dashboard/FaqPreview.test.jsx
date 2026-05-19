import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FaqPreview from "./FaqPreview.jsx";

describe("FaqPreview", () => {
  it("renders FAQ entries", () => {
    // Arrange
    const faqEntries = [
      {
        id: 1,
        question: "Why is my API request failing?",
        answer: "Check the route, server logs, and network response.",
        category: "Debugging",
      },
    ];

    // Act
    render(<FaqPreview faqEntries={faqEntries} />);

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /why is my api request failing/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/check the route/i)).toBeInTheDocument();
    expect(screen.getByText(/debugging/i)).toBeInTheDocument();
  });

  it("renders an empty message when no FAQ entries are provided", () => {
    // Act
    render(<FaqPreview />);

    // Assert
    expect(screen.getByText(/no faq entries yet/i)).toBeInTheDocument();
  });

  it("filters FAQ entries by typed search text", () => {
    // Arrange
    const faqEntries = [
      {
        id: 1,
        question: "Why is my fetch request failing?",
        answer: "Check the request URL and server status.",
        category: "APIs",
      },
      {
        id: 2,
        question: "How do I fix a merge conflict?",
        answer: "Review the conflict markers and choose what to keep.",
        category: "Git & GitHub",
      },
    ];

    render(<FaqPreview faqEntries={faqEntries} />);

    // Act
    fireEvent.change(
      screen.getByRole("searchbox", { name: /filter faq entries/i }),
      {
        target: { value: "merge" },
      },
    );

    // Assert
    expect(
      screen.queryByText(/why is my fetch request failing/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/how do i fix a merge conflict/i),
    ).toBeInTheDocument();
  });
});
