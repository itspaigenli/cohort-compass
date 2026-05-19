import { describe, expect, it } from "vitest";
import {
  buildLocalUnifiedSearchResults,
  mergeUnifiedSearchResults,
} from "./unifiedSearchHelpers.js";

describe("unifiedSearchHelpers", () => {
  it("matches content documents by primary metadata", () => {
    // Arrange
    const query = "html";

    // Act
    const results = buildLocalUnifiedSearchResults({
      query,
      links: [],
      faqEntries: [],
      contentDocuments: [
        {
          slug: "program/participant-handbook",
          title: "Participant Handbook",
          body: "This mentions HTML and program expectations.",
          summary: "",
          excerpt: "",
          section: "program",
          category: "handbook",
          topic: "participant",
          tags: ["html"],
          search_terms: [],
        },
      ],
      curriculumReferences: [],
    });

    // Assert
    expect(results.contentDocuments).toHaveLength(1);
  });

  it("does not match content documents on weak body-only mentions", () => {
    // Arrange
    const query = "coding challenges";

    // Act
    const results = buildLocalUnifiedSearchResults({
      query,
      links: [],
      faqEntries: [],
      contentDocuments: [
        {
          slug: "program/participant-handbook",
          title: "Participant Handbook",
          body: "This doc briefly references code problems and challenge prep.",
          summary: "",
          excerpt: "",
          section: "program",
          category: "handbook",
          topic: "participant",
          tags: ["handbook", "onboarding"],
          search_terms: ["participant handbook"],
        },
      ],
      curriculumReferences: [],
    });

    // Assert
    expect(results.contentDocuments).toHaveLength(0);
  });

  it("matches curriculum references across coding/code challenge variants", () => {
    // Arrange
    const query = "coding challenges";

    // Act
    const results = buildLocalUnifiedSearchResults({
      query,
      links: [],
      faqEntries: [],
      contentDocuments: [],
      curriculumReferences: [
        {
          slug: "curriculum/code-challenges",
          title: "code-challenges",
          relativePath: "code-challenges/README.md",
          summary: "Coding challenge practice for participants.",
          tags: ["curriculum", "challenge"],
        },
      ],
    });

    // Assert
    expect(results.curriculumReferences).toHaveLength(1);
  });

  it("matches faq entries by question and error topic", () => {
    // Arrange
    const query = "merge conflict";

    // Act
    const results = buildLocalUnifiedSearchResults({
      query,
      links: [],
      faqEntries: [
        {
          id: 1,
          question: "How do I fix a merge conflict?",
          answer: "Resolve the markers and commit the file.",
          error_topic: "merge conflict",
          category: "Git & GitHub",
          tags: ["git", "debugging"],
        },
      ],
      contentDocuments: [],
      curriculumReferences: [],
    });

    // Assert
    expect(results.faqEntries).toHaveLength(1);
  });

  it("merges server and local results without duplicates", () => {
    // Arrange
    const serverResults = {
      query: "html",
      links: [],
      faqEntries: [{ id: 1, question: "HTML FAQ" }],
      contentDocuments: [{ slug: "html-docs", title: "HTML Docs" }],
      curriculumReferences: [],
    };
    const localResults = {
      query: "html",
      links: [],
      faqEntries: [
        { id: 1, question: "HTML FAQ" },
        { id: 2, question: "CSS FAQ" },
      ],
      contentDocuments: [
        { slug: "html-docs", title: "HTML Docs" },
        { slug: "html-forms", title: "HTML Forms" },
      ],
      curriculumReferences: [],
    };

    // Act
    const merged = mergeUnifiedSearchResults(
      serverResults,
      localResults,
    );

    // Assert
    expect(merged.faqEntries).toHaveLength(2);
    expect(merged.contentDocuments).toHaveLength(2);
  });
});
