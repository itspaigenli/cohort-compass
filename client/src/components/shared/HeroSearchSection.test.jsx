import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HeroSearchSection from "./HeroSearchSection.jsx";

describe("HeroSearchSection", () => {
  it("renders the hero search experience", () => {
    // Arrange
    const handleSearch = vi.fn();
    render(
      <HeroSearchSection
        title="Cohort Compass"
        query="react"
        onQueryChange={() => {}}
        onSearch={handleSearch}
        backgroundSrc="/hero.png"
        secondaryActionLabel="Open debugging FAQ"
        secondaryActionHref="#faq"
      />,
    );

    // Act
    fireEvent.click(
      screen.getByRole("button", { name: /search student hub/i }),
    );

    // Assert
    expect(
      screen.getByRole("heading", { name: /cohort compass/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /open debugging faq/i }),
    ).toHaveAttribute("href", "#faq");
    expect(handleSearch).toHaveBeenCalledWith("react");
  });
});
