import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SearchResultsSection from "./SearchResultsSection.jsx";

describe("SearchResultsSection", () => {
  it("renders the section title and count", () => {
    render(
      <SearchResultsSection
        title="Resources"
        items={[{ id: 1, title: "React Docs" }]}
        emptyLabel="No results"
        renderItem={(item) => <div key={item.id}>{item.title}</div>}
      />,
    );

    expect(screen.getByRole("heading", { name: "Resources" })).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("stays collapsed by default on mobile and opens when toggled", () => {
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

    expect(screen.queryByText("React Docs")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Resources/i }));

    expect(screen.getByText("React Docs")).toBeInTheDocument();

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    });
  });
});
