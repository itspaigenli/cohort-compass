import { fireEvent, render, screen, within } from "@testing-library/react";
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

  it("shows matching search results in clear groups", () => {
    // Arrange
    render(<SearchPage />);

    // Act
    fireEvent.change(
      screen.getByRole("searchbox", { name: /search the student hub/i }),
      {
        target: { value: "react" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    const resourcesGroup = screen.getByRole("region", {
      name: /resources/i,
    });
    const faqGroup = screen.getByRole("region", {
      name: /faq/i,
    });

    // Assert
    expect(within(resourcesGroup).getByText(/react docs/i)).toBeInTheDocument();
    expect(
      within(faqGroup).getByText(/how do i manage react state/i),
    ).toBeInTheDocument();
  });

  it("shows a friendly empty state when there are no search matches", () => {
    // Arrange
    render(<SearchPage />);

    // Act
    fireEvent.change(
      screen.getByRole("searchbox", { name: /search the student hub/i }),
      {
        target: { value: "database" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    // Assert
    expect(screen.getByText(/no results found for database/i)).toBeInTheDocument();
  });
});
