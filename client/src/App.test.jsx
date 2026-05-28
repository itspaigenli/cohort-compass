import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";

vi.mock("./pages/DashboardPage.jsx", () => ({
  default: () => <p>Dashboard page test content</p>,
}));

vi.mock("./pages/SearchPage.jsx", () => ({
  default: () => <p>Search page test content</p>,
}));

vi.mock("./pages/FAQPage.jsx", () => ({
  default: () => <p>FAQ page test content</p>,
}));

vi.mock("./services/linksApi.js", () => ({
  fetchLinks: vi.fn().mockResolvedValue([]),
}));

vi.mock("./services/faqApi.js", () => ({
  fetchFaqEntries: vi.fn().mockResolvedValue([]),
}));

vi.mock("./services/remindersApi.js", () => ({
  fetchReminders: vi.fn().mockResolvedValue([]),
}));

vi.mock("./services/scheduleApi.js", () => ({
  fetchScheduleItems: vi.fn().mockResolvedValue([]),
}));

vi.mock("./services/contentApi.js", () => ({
  fetchContentDocuments: vi.fn().mockResolvedValue([]),
}));

vi.mock("./services/curriculumApi.js", () => ({
  fetchCurriculumReferences: vi.fn().mockResolvedValue([]),
}));

vi.mock("./services/searchApi.js", () => ({
  searchStudentHub: vi.fn().mockResolvedValue({
    links: [],
    faqEntries: [],
    curriculumReferences: [],
    contentDocuments: [],
  }),
}));

describe("App", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("renders the dashboard page inside the app shell", async () => {
    // Arrange
    render(<App />);

    // Act
    // No user action is needed because the app shell renders on page load.

    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      await screen.findByText(/dashboard page test content/i),
    ).toBeInTheDocument();
  });

  it("renders the search page when the hash is search", async () => {
    // Arrange
    window.location.hash = "#search";

    // Act
    render(<App />);

    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      await screen.findByText(/search page test content/i),
    ).toBeInTheDocument();
  });

  it("renders the FAQ page when the hash is faq", async () => {
    // Arrange
    window.location.hash = "#faq";

    // Act
    render(<App />);

    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(await screen.findByText(/faq page test content/i)).toBeInTheDocument();
  });
});
