import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FAQList from "./FAQList.jsx";

describe("FAQList", () => {
  it("renders each FAQ entry", () => {
    render(
      <FAQList
        entries={[
          {
            id: 1,
            question: "What is a merge conflict?",
            answer: "A conflict in Git.",
            category: "Git",
            error_topic: "merge conflict",
          },
        ]}
      />,
    );

    expect(screen.getByText("What is a merge conflict?")).toBeInTheDocument();
  });
});
