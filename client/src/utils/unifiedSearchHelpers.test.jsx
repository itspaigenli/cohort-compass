import { describe, expect, it } from "vitest";
import {
  buildLocalUnifiedSearchResults,
  mergeUnifiedSearchResults,
} from "./unifiedSearchHelpers.js";

describe("unifiedSearchHelpers", () => {
  it("matches content documents by primary metadata", () => {
    const results = buildLocalUnifiedSearchResults({
      query: "html",
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

    expect(results.contentDocuments).toHaveLength(1);
  });

  it("does not match content documents on weak body-only mentions", () => {
    const results = buildLocalUnifiedSearchResults({
      query: "coding challenges",
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

    expect(results.contentDocuments).toHaveLength(0);
  });

  it("matches curriculum references across coding/code challenge variants", () => {
    const results = buildLocalUnifiedSearchResults({
      query: "coding challenges",
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

    expect(results.curriculumReferences).toHaveLength(1);
  });

  it("matches faq entries by question and error topic", () => {
    const results = buildLocalUnifiedSearchResults({
      query: "merge conflict",
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

    expect(results.faqEntries).toHaveLength(1);
  });

  it("merges server and fallback results without duplicates", () => {
    const merged = mergeUnifiedSearchResults(
      {
        query: "html",
        links: [],
        faqEntries: [{ id: 1, question: "HTML FAQ" }],
        contentDocuments: [{ slug: "html-docs", title: "HTML Docs" }],
        curriculumReferences: [],
      },
      {
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
      },
    );

    expect(merged.faqEntries).toHaveLength(2);
    expect(merged.contentDocuments).toHaveLength(2);
  });
});
