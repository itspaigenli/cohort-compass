import { getJson, requestJson } from "./api.js";

export async function fetchReminders() {
  const data = await getJson("/reminders", { reminders: [] });

  return data.reminders;
}

export async function createReminder({ text, due_at = null }) {
  const data = await requestJson("/reminders", {
    method: "POST",
    body: JSON.stringify({ text, due_at }),
  });

  return data.reminder;
}

export async function updateReminder(id, updates) {
  const data = await requestJson(`/reminders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

  return data.reminder;
}

export async function deleteReminder(id) {
  return requestJson(`/reminders/${id}`, {
    method: "DELETE",
  });
}
