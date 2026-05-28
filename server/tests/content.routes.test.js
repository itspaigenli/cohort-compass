import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/index.js";
import {
  getContentDocument,
  listContentDocuments,
} from "../src/models/contentModel.js";

vi.mock("../src/models/contentModel.js", () => ({
  getContentDocument: vi.fn(),
  listContentDocuments: vi.fn(),
}));

describe("GET /api/content", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns content documents from the content model", async () => {
    // Arrange
    const contentDocuments = [
      {
        slug: "react/debugging",
        title: "React Debugging Notes",
      },
    ];

    listContentDocuments.mockResolvedValue(contentDocuments);

    // Act
    const response = await request(app).get("/api/content");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ contentDocuments });
  });

  it("returns one content document by slug", async () => {
    // Arrange
    const contentDocument = {
      slug: "react/debugging",
      title: "React Debugging Notes",
    };

    getContentDocument.mockResolvedValue(contentDocument);

    // Act
    const response = await request(app).get("/api/content/doc?slug=react/debugging");

    // Assert
    expect(response.status).toBe(200);
    expect(getContentDocument).toHaveBeenCalledWith("react/debugging");
    expect(response.body).toEqual({ contentDocument });
  });
});
