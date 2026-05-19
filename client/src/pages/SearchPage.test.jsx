import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SearchPage from "./SearchPage.jsx";

describe("SearchPage", () => {
  it("renders the shared hero heading and search summary", () => {
    render(
      <SearchPage
        query="react"
        onSearch={() => {}}
        results={{
          links: [{ id: 1, title: "React Docs", url: "https://react.dev", category: "technical docs" }],
          faqEntries: [{ id: 1, question: "React FAQ", answer: "A", category: "React + Vite" }],
          contentDocuments: [{ slug: "react-doc", title: "React Doc", relativePath: "docs/react.md" }],
          curriculumReferences: [{ slug: "react-curriculum", title: "react-js", relativePath: "react-js" }],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Search the Student Hub" })).toBeInTheDocument();
    expect(screen.getByText('Results for "react"')).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to homepage" })).toHaveAttribute("href", "#dashboard");
    expect(screen.queryByText("Back to homepage")).not.toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search docs, tools, debugging help, or a topic"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to top" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1 links" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1 faq" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1 curriculum" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1 docs" })).toBeInTheDocument();
  });

  it("shows empty result cards before any search runs", () => {
    render(
      <SearchPage
        query=""
        onSearch={() => {}}
        results={{
          links: [{ id: 1, title: "Should stay hidden" }],
          faqEntries: [{ id: 2, question: "Should stay hidden" }],
          contentDocuments: [{ slug: "doc-1", title: "Should stay hidden" }],
          curriculumReferences: [{ slug: "curriculum-1", title: "Should stay hidden" }],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Suggested Videos" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Links" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Techtonica Curriculum Repo" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Compass Content Docs" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Debugging FAQ" })).toBeInTheDocument();
    expect(screen.getByText("No curated video suggestions yet.")).toBeInTheDocument();
    expect(screen.getByText("No links yet.")).toBeInTheDocument();
    expect(screen.getByText("No FAQ matches yet.")).toBeInTheDocument();
    expect(screen.queryByText("Should stay hidden")).not.toBeInTheDocument();
  });

  it("shows curated video suggestions for known topics", () => {
    render(
      <SearchPage
        query="html"
        onSearch={() => {}}
        results={{
          links: [],
          faqEntries: [],
          contentDocuments: [],
          curriculumReferences: [],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Suggested Videos" })).toBeInTheDocument();
    expect(screen.getByText("HTML Full Course for Beginners")).toBeInTheDocument();
    expect(screen.getByLabelText("Search summary")).toBeInTheDocument();
  });

  it("shows FAQ matches in a dedicated search section", () => {
    render(
      <SearchPage
        query="git"
        onSearch={() => {}}
        results={{
          links: [],
          faqEntries: [
            {
              id: 1,
              question: "How do I fix a merge conflict?",
              answer: "Review the conflict markers and resolve the file.",
              category: "Git & GitHub",
              error_topic: "merge conflict",
            },
          ],
          contentDocuments: [],
          curriculumReferences: [],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Debugging FAQ" })).toBeInTheDocument();
    expect(screen.getByText("How do I fix a merge conflict?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse full FAQ" })).toHaveAttribute("href", "#faq");
    expect(screen.getByRole("heading", { name: "Links" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Techtonica Curriculum Repo" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Compass Content Docs" })).toBeInTheDocument();
  });

  it("opens the matching section on mobile when a summary pill is clicked", async () => {
    const originalInnerWidth = window.innerWidth;
    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
    const scrollIntoView = vi.fn();

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 430,
    });

    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    render(
      <SearchPage
        query="git"
        onSearch={() => {}}
        results={{
          links: [],
          faqEntries: [
            {
              id: 1,
              question: "How do I fix a merge conflict?",
              answer: "Review the conflict markers and resolve the file.",
              category: "Git & GitHub",
              error_topic: "merge conflict",
            },
          ],
          contentDocuments: [],
          curriculumReferences: [],
        }}
      />,
    );

    expect(screen.queryByText("How do I fix a merge conflict?")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "1 faq" }));

    expect(screen.getByText("How do I fix a merge conflict?")).toBeInTheDocument();

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    });
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });
});
