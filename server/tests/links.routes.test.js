import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/index.js";
import { listLinks } from "../src/models/linksModel.js";

vi.mock("../src/models/linksModel.js", () => ({
  listLinks: vi.fn(),
}));

describe("GET /api/links", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns important links from the links model", async () => {
    const links = [
      {
        id: 1,
        title: "React Documentation",
        url: "https://react.dev/",
        category: "technical docs",
      },
    ];

    listLinks.mockResolvedValue(links);

    const response = await request(app).get("/api/links");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ links });
  });
});
