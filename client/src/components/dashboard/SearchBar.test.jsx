import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SearchBar from "./SearchBar.jsx";

describe("SearchBar", () => {
  it("submits the typed search text", () => {
    // Arrange
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);

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
});
