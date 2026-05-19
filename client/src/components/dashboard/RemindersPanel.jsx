import { useState } from "react";
import {
  createReminder,
  deleteReminder,
  updateReminder,
} from "../../services/remindersApi.js";
import { formatReminderDueDate, parseCalendarDate } from "../../utils/dateTime.js";

function sortReminders(items = []) {
  return [...items].sort((left, right) => {
    if (left.done !== right.done) {
      return Number(left.done) - Number(right.done);
    }

    const leftCreatedAt = left.created_at ? parseCalendarDate(left.created_at).getTime() : 0;
    const rightCreatedAt = right.created_at ? parseCalendarDate(right.created_at).getTime() : 0;

    return rightCreatedAt - leftCreatedAt;
  });
}

function buildDueAt(dateValue, timeValue) {
  if (!dateValue) {
    return null;
  }

  if (!timeValue) {
    return dateValue;
  }

  return `${dateValue}T${timeValue}`;
}

export default function RemindersPanel({
  reminders = [],
  onRemindersChange,
  className = "",
}) {
  const [draftText, setDraftText] = useState("");
  const [draftDueDate, setDraftDueDate] = useState("");
  const [draftDueTime, setDraftDueTime] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const sortedReminders = sortReminders(reminders);

  async function handleSubmit(event) {
    event.preventDefault();

    const text = draftText.trim();

    if (!text) {
      return;
    }

    try {
      setIsSaving(true);
      const reminder = await createReminder({
        text,
        due_at: buildDueAt(draftDueDate, draftDueTime),
      });

      onRemindersChange?.(sortReminders([reminder, ...reminders]));
      setDraftText("");
      setDraftDueDate("");
      setDraftDueTime("");
      setActionError("");
    } catch {
      setActionError("Unable to add that reminder right now.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(reminder) {
    try {
      const updatedReminder = await updateReminder(reminder.id, {
        done: !reminder.done,
      });

      onRemindersChange?.(
        sortReminders(
          reminders.map((item) =>
            item.id === updatedReminder.id ? updatedReminder : item,
          ),
        ),
      );
      setActionError("");
    } catch {
      setActionError("Unable to update that reminder right now.");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteReminder(id);

      onRemindersChange?.(
        reminders.filter((reminder) => reminder.id !== id),
      );
      setActionError("");
    } catch {
      setActionError("Unable to remove that reminder right now.");
    }
  }

  return (
    <section
      id="dashboard-reminders"
      className={`panel reminders-section reminders-panel ${className}`.trim()}
    >
      <div className="panel-header">
        <h2>Reminder list</h2>
      </div>

      <form className="reminders-form" onSubmit={handleSubmit}>
        <input
          aria-label="Add reminder"
          className="reminders-text-input"
          type="text"
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
          placeholder="Add a reminder"
        />
        <input
          aria-label="Reminder due date"
          className="reminders-date-input"
          type="date"
          value={draftDueDate}
          onChange={(event) => setDraftDueDate(event.target.value)}
        />
        <input
          aria-label="Reminder due time"
          className="reminders-time-input"
          type="time"
          value={draftDueTime}
          onChange={(event) => setDraftDueTime(event.target.value)}
        />
        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving" : "Add"}
        </button>
      </form>

      {actionError ? <p className="reminders-status">{actionError}</p> : null}

      {sortedReminders.length ? (
        <ul className="stack-list reminders-list">
          {sortedReminders.map((reminder) => {
            const dueDate = formatReminderDueDate(reminder.due_at);

            return (
              <li
                key={reminder.id}
                className={`mini-card reminder-item${
                  reminder.done ? " done" : ""
                }`}
              >
                <label className="reminder-checkbox">
                  <input
                    type="checkbox"
                    checked={reminder.done}
                    onChange={() => handleToggle(reminder)}
                  />
                  <span className="reminder-copy">
                    <span>{reminder.text}</span>
                    {dueDate ? (
                      <span className="reminder-due-date">Due {dueDate}</span>
                    ) : null}
                  </span>
                </label>
                <button
                  type="button"
                  className="inline-button reminder-remove"
                  onClick={() => handleDelete(reminder.id)}
                  aria-label={`Remove reminder ${reminder.text}`}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {!isSaving && !sortedReminders.length ? (
        <p className="empty-state">
          No reminders yet. Add one to keep track of your next step.
        </p>
      ) : null}
    </section>
  );
}
