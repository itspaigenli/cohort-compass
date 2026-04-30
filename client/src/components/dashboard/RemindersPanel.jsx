import { useEffect, useState } from "react";
import {
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
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

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

  async function handleToggle(reminder) {
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
  }

  async function handleDelete(id) {
    await deleteReminder(id);

    setReminders((currentReminders) =>
      currentReminders.filter((reminder) => reminder.id !== id),
    );
  }

  if (status === "loading") {
    return <p>Loading reminders...</p>;
  }

  if (status === "error") {
    return <p>{errorMessage}</p>;
  }

  if (!reminders.length) {
    return <p>No reminders yet.</p>;
  }

  return (
    <ul>
      {reminders.map((reminder) => (
        <li key={reminder.id}>
          <label className="reminder-item-label">
            <input
              type="checkbox"
              checked={reminder.done}
              onChange={() => handleToggle(reminder)}
            />
            <span>{reminder.text}</span>
          </label>
          {formatDueDate(reminder.due_at) ? (
            <p>Due {formatDueDate(reminder.due_at)}</p>
          ) : null}
          <button type="button" onClick={() => handleDelete(reminder.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
