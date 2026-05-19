import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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

  it("lets a student type and submit a search term", async () => {
    // Arrange
    const handleSearch = vi.fn().mockResolvedValue();
    render(<SearchPage onSearch={handleSearch} />);

    // Act
    fireEvent.change(
      screen.getByRole("searchbox", {
        name: /search docs, tools, debugging help, or a topic/i,
      }),
      {
        target: { value: "react hooks" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    // Assert
    expect(handleSearch).toHaveBeenCalledWith("react hooks");
  });

  it("shows matching search results in clear groups", () => {
    // Arrange
    render(
      <SearchPage
        query="react"
        results={{
          links: [
            {
              id: 1,
              title: "React Documentation",
              description: "Official React documentation for components and hooks.",
            },
          ],
          faqEntries: [
            {
              id: 2,
              question: "Why is my useEffect running twice?",
              answer: "React Strict Mode may run effects more than once.",
            },
          ],
          curriculumReferences: [],
          contentDocuments: [],
        }}
      />,
    );

    const linksGroup = screen.getByRole("region", { name: /links/i });
    const faqGroup = screen.getByRole("region", { name: /debugging faq/i });

    // Assert
    expect(
      within(linksGroup).getByRole("heading", {
        name: /react documentation/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(faqGroup).getByText(/why is my useeffect running twice/i),
    ).toBeInTheDocument();
  });

  it("shows a friendly empty state when there are no search matches", () => {
    // Arrange
    render(
      <SearchPage
        query="database"
        results={{
          links: [],
          faqEntries: [],
          curriculumReferences: [],
          contentDocuments: [],
        }}
      />,
    );

    // Assert
    expect(
      screen.getByText(/no results found for database/i),
    ).toBeInTheDocument();
  });
});
