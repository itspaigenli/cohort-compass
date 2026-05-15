import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchPage from "./SearchPage.jsx";
import { searchStudentHub } from "../services/searchApi.js";

vi.mock("../services/searchApi.js", () => ({
  searchStudentHub: vi.fn(),
}));

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    searchStudentHub.mockResolvedValue({
      links: [],
      faqEntries: [],
    });
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
    expect(
      await screen.findByText(/you searched for react hooks/i),
    ).toBeInTheDocument();
    expect(searchStudentHub).toHaveBeenCalledWith("react hooks");
  });

  it("shows matching search results in clear groups", async () => {
    // Arrange
    searchStudentHub.mockResolvedValue({
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
    });
    render(<SearchPage />);

    // Act
    fireEvent.change(
      screen.getByRole("searchbox", { name: /search the student hub/i }),
      {
        target: { value: "react" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    const linksGroup = await screen.findByRole("region", {
      name: /links/i,
    });
    const faqGroup = screen.getByRole("region", {
      name: /faq/i,
    });

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

  it("shows a friendly empty state when there are no search matches", async () => {
    // Arrange
    searchStudentHub.mockResolvedValue({
      links: [],
      faqEntries: [],
    });
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
    expect(
      await screen.findByText(/no results found for database/i),
    ).toBeInTheDocument();
  });
});
