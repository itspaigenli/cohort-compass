import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingState from "./LoadingState.jsx";

describe("LoadingState", () => {
  it("renders the loading label", () => {
    render(<LoadingState label="Loading data" />);

    expect(screen.getByText("Loading data")).toBeInTheDocument();
  });
});
