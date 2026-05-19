import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FAQPage from "./FAQPage.jsx";

const faqEntries = [
  {
    id: 1,
    question: "Why is my useEffect running twice?",
    answer: "React Strict Mode may run effects more than once.",
    error_topic: "useEffect",
    category: "React + Vite",
    tags: ["React", "useEffect"],
  },
  {
    id: 2,
    question: "Why does my Express route return 404?",
    answer: "Check the route path, HTTP method, and mounted router.",
    error_topic: "404 route",
    category: "Node & Express",
    tags: ["Express", "Node"],
  },
  {
    id: 3,
    question: "Why is Vite not picking up my latest changes?",
    answer: "Restart the dev server and confirm the file is inside the client project.",
    error_topic: "vite dev server",
    category: "React + Vite",
    tags: ["React", "Vite"],
  },
];

describe("FAQPage", () => {
  it("renders the FAQ page heading", () => {
    render(<FAQPage faqEntries={faqEntries} query="" />);

    expect(screen.getByRole("heading", { name: "Debugging FAQ" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to search" })).toHaveAttribute("href", "#search");
    expect(screen.getByRole("button", { name: "Back to top" })).toBeInTheDocument();
  });

  it("maps chip categories to matching faq entries", () => {
    render(<FAQPage faqEntries={faqEntries} query="" />);

    fireEvent.click(screen.getByRole("button", { name: "React + Vite" }));

    expect(screen.getByText("Search for a keyword to see matching FAQ entries.")).toBeInTheDocument();
    expect(screen.queryByText("Why is my useEffect running twice?")).not.toBeInTheDocument();
  });

  it("lets users clear an active topic by clicking the same chip again", () => {
    render(<FAQPage faqEntries={faqEntries} query="useEffect" />);

    fireEvent.click(screen.getByRole("button", { name: "Node & Express" }));
    expect(screen.queryByText("Why is my useEffect running twice?")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Node & Express" }));
    expect(screen.getByText("Why is my useEffect running twice?")).toBeInTheDocument();
  });

  it("keeps results empty until a search keyword is entered", () => {
    render(<FAQPage faqEntries={faqEntries} query="" />);

    fireEvent.click(screen.getByRole("button", { name: "Node & Express" }));
    expect(screen.queryByText("Why does my Express route return 404?")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search FAQ questions and answers"), {
      target: { value: "route" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Browse Answers" }));

    expect(screen.getByText("Why does my Express route return 404?")).toBeInTheDocument();
    expect(screen.queryByText("Why is Vite not picking up my latest changes?")).not.toBeInTheDocument();
  });
});
