import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FAQCard from "./FAQCard.jsx";

describe("FAQCard", () => {
  it("renders the question and answer", () => {
    render(
      <FAQCard
        entry={{
          question: "Why is my fetch failing?",
          answer: "Check the URL.",
          category: "APIs",
          error_topic: "fetch",
        }}
      />,
    );

    expect(screen.getByText("Why is my fetch failing?")).toBeInTheDocument();
  });
});
