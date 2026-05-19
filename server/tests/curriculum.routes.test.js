import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/index.js";
import { listCurriculumReferences } from "../src/models/curriculumModel.js";

vi.mock("../src/models/curriculumModel.js", () => ({
  listCurriculumReferences: vi.fn(),
}));

describe("GET /api/curriculum", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns curriculum references from the curriculum model", async () => {
    const curriculumReferences = [
      {
        slug: "react-js",
        title: "React JS",
      },
    ];

    listCurriculumReferences.mockResolvedValue(curriculumReferences);

    const response = await request(app).get("/api/curriculum");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ curriculumReferences });
  });
});
