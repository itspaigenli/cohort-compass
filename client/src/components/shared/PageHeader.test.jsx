import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageHeader from "./PageHeader.jsx";

describe("PageHeader", () => {
  it("renders the page title", () => {
    render(<PageHeader title="Dashboard" description="Overview" />);

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });
});
