import { beforeEach, describe, expect, it, vi } from "vitest";
import { searchContent } from "../src/controllers/searchController.js";
import { searchLinksAndFaq } from "../src/models/searchModel.js";

vi.mock("../src/models/searchModel.js", () => ({
  searchLinksAndFaq: vi.fn(),
}));

function createResponseMock() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe("searchContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns grouped search results from the search model", async () => {
    // Arrange
    const response = createResponseMock();
    const results = {
      links: [],
      faqEntries: [],
      curriculumReferences: [],
      contentDocuments: [],
    };

    searchLinksAndFaq.mockResolvedValue(results);

    // Act
    await searchContent({ query: { q: "react" } }, response);

    // Assert
    expect(searchLinksAndFaq).toHaveBeenCalledWith("react");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(results);
  });

  it("uses an empty search term when q is missing", async () => {
    // Arrange
    const response = createResponseMock();

    searchLinksAndFaq.mockResolvedValue({
      links: [],
      faqEntries: [],
      curriculumReferences: [],
      contentDocuments: [],
    });

    // Act
    await searchContent({ query: {} }, response);

    // Assert
    expect(searchLinksAndFaq).toHaveBeenCalledWith("");
  });
});
