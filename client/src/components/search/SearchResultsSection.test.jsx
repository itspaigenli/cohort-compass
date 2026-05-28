import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SearchResultsSection from "./SearchResultsSection.jsx";

describe("SearchResultsSection", () => {
  it("renders the section title and count", () => {
    // Arrange
    render(
      <SearchResultsSection
        title="Resources"
        items={[{ id: 1, title: "React Docs" }]}
        emptyLabel="No results"
        renderItem={(item) => <div key={item.id}>{item.title}</div>}
      />,
    );

    // Act
    // No user action is needed because the section renders from props.

    // Assert
    expect(screen.getByRole("heading", { name: "Resources" })).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("stays collapsed by default on mobile and opens when toggled", () => {
    // Arrange
    const originalInnerWidth = window.innerWidth;

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 430,
    });

    render(
      <SearchResultsSection
        title="Resources"
        items={[{ id: 1, title: "React Docs" }]}
        emptyLabel="No results"
        renderItem={(item) => <div key={item.id}>{item.title}</div>}
      />,
    );

    // Assert
    expect(screen.queryByText("React Docs")).not.toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: /Resources/i }));

    // Assert
    expect(screen.getByText("React Docs")).toBeInTheDocument();

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    });
  });
});
