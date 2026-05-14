import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LinksPreview from "./LinksPreview.jsx";
import { fetchLinks } from "../../services/linksApi.js";

vi.mock("../../services/linksApi.js", () => ({
  fetchLinks: vi.fn(),
}));

describe("LinksPreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders important links from the API", async () => {
    // Arrange
    fetchLinks.mockResolvedValue([
      {
        id: 1,
        title: "Techtonica",
        url: "https://techtonica.org",
        description: "Program information and resources.",
        category: "Official",
      },
    ]);

    // Act
    render(<LinksPreview />);

    // Assert
    expect(screen.getByText(/loading links/i)).toBeInTheDocument();

    const link = await screen.findByRole("link", { name: /techtonica/i });

    expect(link).toHaveAttribute("href", "https://techtonica.org");
    expect(
      screen.getByText(/program information and resources/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/official/i)).toBeInTheDocument();
  });

  it("renders an empty message when no links are returned", async () => {
    // Arrange
    fetchLinks.mockResolvedValue([]);

    // Act
    render(<LinksPreview />);

    // Assert
    expect(
      await screen.findByText(/no important links yet/i),
    ).toBeInTheDocument();
  });

  it("renders an error message when the API request fails", async () => {
    // Arrange
    fetchLinks.mockRejectedValue(new Error("Links request failed"));

    // Act
    render(<LinksPreview />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/links request failed/i)).toBeInTheDocument();
    });
  });
});
