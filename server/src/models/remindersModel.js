import { query } from "../config/db.js";

const reminderFields = `
  id,
  text,
  done,
  due_at,
  created_at,
  updated_at
`;

export async function listReminders() {
  const result = await query(
    `SELECT ${reminderFields}
    FROM reminders
    ORDER BY done ASC, COALESCE(due_at, created_at) ASC, created_at DESC`,
  );

  return result.rows;
}

export async function createReminder({ text, due_at = null }) {
  const result = await query(
    `INSERT INTO reminders (text, due_at)
    VALUES ($1, $2)
    RETURNING ${reminderFields}`,
    [text, due_at],
  );

  return result.rows[0];
}

export async function updateReminder(id, fields) {
  const updates = [];
  const values = [];

  if (Object.hasOwn(fields, "text")) {
    values.push(fields.text);
    updates.push(`text = $${values.length}`);
  }

  if (Object.hasOwn(fields, "done")) {
    values.push(fields.done);
    updates.push(`done = $${values.length}`);
  }

  if (Object.hasOwn(fields, "due_at")) {
    values.push(fields.due_at);
    updates.push(`due_at = $${values.length}`);
  }

  if (!updates.length) {
    return null;
  }

  values.push(id);

  const result = await query(
    `UPDATE reminders
    SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${values.length}
    RETURNING ${reminderFields}`,
    values,
  );

  return result.rows[0] || null;
}

export async function deleteReminder(id) {
  const result = await query(
    "DELETE FROM reminders WHERE id = $1 RETURNING id",
    [id],
  );

  return result.rowCount > 0;
}
