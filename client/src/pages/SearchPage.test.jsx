import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SearchPage from "./SearchPage.jsx";

describe("SearchPage", () => {
  it("renders the search page shell", () => {
    // Arrange
    render(<SearchPage />);

    // Act
    // No user action is needed because the search page shell renders on page load.

    // Assert
    expect(
      screen.getByRole("heading", { name: /search the student hub/i }),
    ).toBeInTheDocument();
  });

  it("lets a student type and submit a search term", () => {
    // Arrange
    render(<SearchPage />);

    // Act
    fireEvent.change(
      screen.getByRole("searchbox", { name: /search the student hub/i }),
      {
        target: { value: "react hooks" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    // Assert
    expect(screen.getByText(/you searched for react hooks/i)).toBeInTheDocument();
  });
});
