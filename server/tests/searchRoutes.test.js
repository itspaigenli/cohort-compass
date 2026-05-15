import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/index.js";

describe("GET /api/search", () => {
  it("returns grouped links and FAQ results for a search term", async () => {
    // Arrange
    const searchTerm = "react";

    // Act
    const response = await request(app).get(`/api/search?q=${searchTerm}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("links");
    expect(response.body).toHaveProperty("faqEntries");
  });
});
