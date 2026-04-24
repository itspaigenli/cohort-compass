import { query } from "../config/db.js";

export async function getScheduleItems() {
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
    ORDER BY start_time ASC`,
  );

  return result.rows;
}
