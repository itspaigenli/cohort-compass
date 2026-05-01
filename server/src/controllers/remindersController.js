import { fallbackReminders } from "../lib/fallbackData.js";
import {
  createReminder,
  deleteReminder,
  listReminders,
  updateReminder,
} from "../models/remindersModel.js";

function parseReminderId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function parseDueAt(value) {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: null };
  }

  if (typeof value !== "string") {
    return { ok: false };
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return { ok: false };
  }

  return { ok: true, value: parsed.toISOString() };
}

export async function getReminders(req, res) {
  try {
    const reminders = await listReminders();

    res.json({ reminders });
  } catch (error) {
    console.error("Error fetching reminders:", error);

    res.json({
      reminders: fallbackReminders,
      source: "fallback",
    });
  }
}

export async function postReminder(req, res) {
  const text = req.body?.text?.trim();
  const dueAtResult = parseDueAt(req.body?.due_at);

  if (!text) {
    res.status(400).json({ error: "Reminder text is required." });
    return;
  }

  if (!dueAtResult.ok) {
    res.status(400).json({ error: "Reminder due date must be a valid date." });
    return;
  }

  try {
    const reminder = await createReminder({
      text,
      due_at: dueAtResult.value,
    });

    res.status(201).json({ reminder });
  } catch (error) {
    console.error("Error creating reminder:", error);

    res.status(500).json({ error: "Unable to create reminder." });
  }
}

export async function patchReminder(req, res) {
  const id = parseReminderId(req.params.id);

  if (!id) {
    res.status(400).json({ error: "Reminder id must be a positive integer." });
    return;
  }

  const fields = {};

  if (Object.hasOwn(req.body ?? {}, "text")) {
    const text = req.body.text?.trim();

    if (!text) {
      res.status(400).json({ error: "Reminder text cannot be empty." });
      return;
    }

    fields.text = text;
  }

  if (Object.hasOwn(req.body ?? {}, "done")) {
    if (typeof req.body.done !== "boolean") {
      res.status(400).json({ error: "Reminder done value must be true or false." });
      return;
    }

    fields.done = req.body.done;
  }

  if (Object.hasOwn(req.body ?? {}, "due_at")) {
    const dueAtResult = parseDueAt(req.body.due_at);

    if (!dueAtResult.ok) {
      res.status(400).json({ error: "Reminder due date must be a valid date." });
      return;
    }

    fields.due_at = dueAtResult.value;
  }

  if (!Object.keys(fields).length) {
    res.status(400).json({ error: "Provide reminder text, due date, or done state to update." });
    return;
  }

  try {
    const reminder = await updateReminder(id, fields);

    if (!reminder) {
      res.status(404).json({ error: "Reminder not found." });
      return;
    }

    res.json({ reminder });
  } catch (error) {
    console.error("Error updating reminder:", error);

    res.status(500).json({ error: "Unable to update reminder." });
  }
}

export async function deleteReminderById(req, res) {
  const id = parseReminderId(req.params.id);

  if (!id) {
    res.status(400).json({ error: "Reminder id must be a positive integer." });
    return;
  }

  try {
    const deleted = await deleteReminder(id);

    if (!deleted) {
      res.status(404).json({ error: "Reminder not found." });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting reminder:", error);

    res.status(500).json({ error: "Unable to delete reminder." });
  }
}
