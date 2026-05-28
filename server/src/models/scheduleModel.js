import { query } from "../config/db.js";

export async function listScheduleItems(options = {}) {
  const values = [];
  const whereClause = options.date ? "WHERE start_time::date = $1::date" : "";

  if (options.date) {
    values.push(options.date);
  }

  const result = await query(
    `SELECT
      id,
      title,
      description,
      start_time,
      end_time,
      location,
      meeting_url,
      recording_url
    FROM schedule_items
    ${whereClause}
    ORDER BY start_time ASC`,
    values,
  );

  return result.rows;
}
