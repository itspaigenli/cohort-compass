import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingState from "./LoadingState.jsx";

describe("LoadingState", () => {
  it("renders the loading label", () => {
    // Arrange
    render(<LoadingState label="Loading data" />);

    // Act
    // No user action is needed because the label renders from props.

    // Assert
    expect(screen.getByText("Loading data")).toBeInTheDocument();
  });
});
