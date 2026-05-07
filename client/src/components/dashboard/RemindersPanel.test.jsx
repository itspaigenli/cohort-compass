import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RemindersPanel from "./RemindersPanel.jsx";
import {
  createReminder,
  fetchReminders,
} from "../../services/remindersApi.js";

vi.mock("../../services/remindersApi.js", () => ({
  createReminder: vi.fn(),
  deleteReminder: vi.fn(),
  fetchReminders: vi.fn(),
  updateReminder: vi.fn(),
}));

describe("RemindersPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders incomplete reminders before completed reminders", async () => {
    // Arrange
    fetchReminders.mockResolvedValue([
      {
        id: 1,
        text: "Review README links",
        done: true,
        due_at: null,
      },
      {
        id: 2,
        text: "Submit milestone summary",
        done: false,
        due_at: null,
      },
    ]);

    // Act
    render(<RemindersPanel />);

    // Assert
    expect(screen.getByText(/loading reminders/i)).toBeInTheDocument();

    const checkboxes = await screen.findAllByRole("checkbox");

    expect(screen.getByText(/1 remaining · 1 completed/i)).toBeInTheDocument();
    expect(checkboxes[0]).toHaveAccessibleName(/submit milestone summary/i);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toHaveAccessibleName(/review readme links/i);
    expect(checkboxes[1]).toBeChecked();
  });

  it("adds a new reminder from the form", async () => {
    // Arrange
    fetchReminders.mockResolvedValue([]);
    createReminder.mockResolvedValue({
      id: 3,
      text: "Update project notes",
      done: false,
      due_at: null,
    });

    // Act
    render(<RemindersPanel />);

    const reminderInput = await screen.findByLabelText(/add reminder/i);
    fireEvent.change(reminderInput, {
      target: { value: "Update project notes" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    // Assert
    expect(createReminder).toHaveBeenCalledWith({
      text: "Update project notes",
    });
    expect(
      await screen.findByLabelText(/update project notes/i),
    ).toBeInTheDocument();
    expect(reminderInput).toHaveValue("");
  });
});
