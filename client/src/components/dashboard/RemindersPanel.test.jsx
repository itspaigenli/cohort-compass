import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RemindersPanel from "./RemindersPanel.jsx";
import { createReminder } from "../../services/remindersApi.js";

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

  it("renders incomplete reminders before completed reminders", () => {
    // Arrange
    const reminders = [
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
    ];

    // Act
    render(<RemindersPanel reminders={reminders} />);

    // Assert
    const checkboxes = screen.getAllByRole("checkbox");

    expect(screen.getByText(/1 remaining · 1 completed/i)).toBeInTheDocument();
    expect(checkboxes[0]).toHaveAccessibleName(/submit milestone summary/i);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toHaveAccessibleName(/review readme links/i);
    expect(checkboxes[1]).toBeChecked();
  });

  it("adds a new reminder from the form", async () => {
    // Arrange
    const handleRemindersChange = vi.fn();
    createReminder.mockResolvedValue({
      id: 3,
      text: "Update project notes",
      done: false,
      due_at: null,
    });

    // Act
    render(
      <RemindersPanel
        reminders={[]}
        onRemindersChange={handleRemindersChange}
      />,
    );

    const reminderInput = screen.getByLabelText(/add reminder/i);
    fireEvent.change(reminderInput, {
      target: { value: "Update project notes" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    // Assert
    expect(createReminder).toHaveBeenCalledWith({
      text: "Update project notes",
    });
    await waitFor(() => {
      expect(handleRemindersChange).toHaveBeenCalledWith([
        {
          id: 3,
          text: "Update project notes",
          done: false,
          due_at: null,
        },
      ]);
    });
    expect(reminderInput).toHaveValue("");
  });
});
