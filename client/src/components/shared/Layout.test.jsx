import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Layout from "./Layout.jsx";

describe("Layout", () => {
  it("renders app content and footer", () => {
    // Arrange
    render(
      <Layout>
        <p>Page content</p>
      </Layout>,
    );

    // Assert
    expect(screen.getByText(/page content/i)).toBeInTheDocument();
    expect(screen.getByText(/© techtonica 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/designed by paige li/i)).toBeInTheDocument();
  });
});
