import { useEffect, useState } from "react";
import {
  createReminder,
  deleteReminder,
  fetchReminders,
  updateReminder,
} from "../../services/remindersApi.js";

function sortReminders(items = []) {
  return [...items].sort((left, right) => Number(left.done) - Number(right.done));
}

function formatDueDate(value) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function RemindersPanel() {
  const [reminders, setReminders] = useState([]);
  const [draftText, setDraftText] = useState("");
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const completedCount = reminders.filter((reminder) => reminder.done).length;
  const remainingCount = reminders.length - completedCount;

  useEffect(() => {
    async function loadReminders() {
      try {
        const items = await fetchReminders();

        setReminders(sortReminders(items));
        setStatus("success");
      } catch (error) {
        setErrorMessage(error.message);
        setStatus("error");
      }
    }

    loadReminders();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const text = draftText.trim();

    if (!text) {
      return;
    }

    try {
      const reminder = await createReminder({ text });

      setReminders((currentReminders) =>
        sortReminders([reminder, ...currentReminders]),
      );
      setDraftText("");
      setActionError("");
    } catch {
      setActionError("Unable to add that reminder right now.");
    }
  }

  async function handleToggle(reminder) {
    try {
      const updatedReminder = await updateReminder(reminder.id, {
        done: !reminder.done,
      });

      setReminders((currentReminders) =>
        sortReminders(
          currentReminders.map((item) =>
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

      setReminders((currentReminders) =>
        currentReminders.filter((reminder) => reminder.id !== id),
      );
      setActionError("");
    } catch {
      setActionError("Unable to remove that reminder right now.");
    }
  }

  if (status === "loading") {
    return <p>Loading reminders...</p>;
  }

  if (status === "error") {
    return <p>{errorMessage}</p>;
  }

  return (
    <>
      <form className="reminders-form" onSubmit={handleSubmit}>
        <label htmlFor="new-reminder">Add reminder</label>
        <div className="reminders-form-row">
          <input
            id="new-reminder"
            type="text"
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            placeholder="Add your next task"
          />
          <button type="submit">Add</button>
        </div>
      </form>

      {actionError ? <p>{actionError}</p> : null}
      {!reminders.length ? <p>No reminders yet.</p> : null}

      {reminders.length ? (
        <>
          <p>
            {remainingCount} remaining · {completedCount} completed
          </p>
          <ul>
            {reminders.map((reminder) => {
              const dueDate = formatDueDate(reminder.due_at);

              return (
                <li key={reminder.id}>
                  <label className="reminder-item-label">
                    <input
                      type="checkbox"
                      checked={reminder.done}
                      onChange={() => handleToggle(reminder)}
                    />
                    <span>{reminder.text}</span>
                  </label>
                  {dueDate ? <p>Due {dueDate}</p> : null}
                  <button
                    type="button"
                    onClick={() => handleDelete(reminder.id)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </>
  );
}
