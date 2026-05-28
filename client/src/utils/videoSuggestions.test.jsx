import { getSuggestedVideos } from "./videoSuggestions.js";
import { describe, expect, it } from "vitest";

describe("videoSuggestions", () => {
  it("returns curated videos for html", () => {
    // Arrange
    const query = "html";

    // Act
    const videos = getSuggestedVideos(query);

    // Assert
    expect(videos.length).toBeGreaterThan(0);
    expect(videos[0].resource_type).toBe("video");
  });

  it("maps git-related aliases to git videos", () => {
    // Arrange
    const query = "pull request";

    // Act
    const videos = getSuggestedVideos(query);

    // Assert
    expect(videos.some((video) => video.topic === "git")).toBe(true);
  });
});
