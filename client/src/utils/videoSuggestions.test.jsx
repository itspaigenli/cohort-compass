import { getSuggestedVideos } from "./videoSuggestions.js";
import { describe, expect, it } from "vitest";

describe("videoSuggestions", () => {
  it("returns curated videos for html", () => {
    const videos = getSuggestedVideos("html");

    expect(videos.length).toBeGreaterThan(0);
    expect(videos[0].resource_type).toBe("video");
  });

  it("maps git-related aliases to git videos", () => {
    const videos = getSuggestedVideos("pull request");

    expect(videos.some((video) => video.topic === "git")).toBe(true);
  });
});
