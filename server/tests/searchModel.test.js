import { beforeEach, describe, expect, it, vi } from "vitest";
import { query } from "../src/config/db.js";
import { listCurriculumReferences } from "../src/models/curriculumModel.js";
import { searchLinksAndFaq } from "../src/models/searchModel.js";

vi.mock("../src/config/db.js", () => ({
  query: vi.fn(),
}));

vi.mock("../src/models/curriculumModel.js", () => ({
  listCurriculumReferences: vi.fn(),
}));

describe("searchLinksAndFaq", () => {
  beforeEach(() => {
    query.mockReset();
    listCurriculumReferences.mockReset();
  });

  it("returns matching links, FAQ entries, and curriculum references", async () => {
    // Arrange
    query
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            title: "React Documentation",
            url: "https://react.dev/",
            category: "technical docs",
            description: "Official React documentation.",
            tags: ["react", "documentation"],
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 2,
            question: "Why is my useEffect running twice?",
            answer: "React Strict Mode may run effects more than once.",
            error_topic: "useEffect",
            category: "React + Vite",
            tags: ["react", "useEffect"],
          },
        ],
      });
    listCurriculumReferences.mockResolvedValue([
      {
        slug: "react-js",
        title: "React JS",
        relativePath: "react-js",
        summary: "Techtonica React curriculum reference.",
      },
    ]);

    // Act
    const results = await searchLinksAndFaq("react");

    // Assert
    expect(results.links).toHaveLength(1);
    expect(results.links[0].title).toBe("React Documentation");
    expect(results.faqEntries).toHaveLength(1);
    expect(results.faqEntries[0].question).toBe(
      "Why is my useEffect running twice?",
    );
    expect(results.curriculumReferences).toHaveLength(1);
    expect(results.curriculumReferences[0].title).toBe("React JS");
  });

  it("uses a parameterized search term for both database queries", async () => {
    // Arrange
    query.mockResolvedValue({ rows: [] });
    listCurriculumReferences.mockResolvedValue([]);

    // Act
    await searchLinksAndFaq("react");

    // Assert
    expect(query).toHaveBeenCalledTimes(2);
    expect(query.mock.calls[0][1]).toEqual(["%react%"]);
    expect(query.mock.calls[1][1]).toEqual(["%react%"]);
  });

  it("returns empty groups when the search term is blank", async () => {
    // Arrange
    const blankSearchTerm = "   ";

    // Act
    const results = await searchLinksAndFaq(blankSearchTerm);

    // Assert
    expect(results).toEqual({
      links: [],
      faqEntries: [],
      curriculumReferences: [],
    });
    expect(query).not.toHaveBeenCalled();
  });
});
