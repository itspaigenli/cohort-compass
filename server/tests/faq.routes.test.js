import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/index.js";
import { listFaqEntries } from "../src/models/faqModel.js";

vi.mock("../src/models/faqModel.js", () => ({
  listFaqEntries: vi.fn(),
}));

describe("GET /api/faq", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns FAQ entries from the FAQ model", async () => {
    // Arrange
    const faqEntries = [
      {
        id: 1,
        question: "Why is my useEffect running twice?",
        answer: "React Strict Mode can run effects more than once.",
      },
    ];

    listFaqEntries.mockResolvedValue(faqEntries);

    // Act
    const response = await request(app).get("/api/faq");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ faqEntries });
  });
});
