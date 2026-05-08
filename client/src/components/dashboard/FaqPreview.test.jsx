import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FaqPreview from "./FaqPreview.jsx";
import { fetchFaqEntries } from "../../services/faqApi.js";

vi.mock("../../services/faqApi.js", () => ({
  fetchFaqEntries: vi.fn(),
}));

describe("FaqPreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders FAQ entries from the API", async () => {
    // Arrange
    fetchFaqEntries.mockResolvedValue([
      {
        id: 1,
        question: "Why is my API request failing?",
        answer: "Check the route, server logs, and network response.",
        category: "Debugging",
      },
    ]);

    // Act
    render(<FaqPreview />);

    // Assert
    expect(screen.getByText(/loading faq/i)).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        name: /why is my api request failing/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/check the route/i)).toBeInTheDocument();
    expect(screen.getByText(/debugging/i)).toBeInTheDocument();
  });

  it("renders an empty message when no FAQ entries are returned", async () => {
    // Arrange
    fetchFaqEntries.mockResolvedValue([]);

    // Act
    render(<FaqPreview />);

    // Assert
    expect(await screen.findByText(/no faq entries yet/i)).toBeInTheDocument();
  });

  it("renders an error message when the API request fails", async () => {
    // Arrange
    fetchFaqEntries.mockRejectedValue(new Error("FAQ request failed"));

    // Act
    render(<FaqPreview />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/faq request failed/i)).toBeInTheDocument();
    });
  });
});
