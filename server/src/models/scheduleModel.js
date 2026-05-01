import { checkDatabaseConnection, query } from "../config/db.js";
import { fallbackScheduleItems } from "../lib/fallbackData.js";

export async function listScheduleItems() {
  const databaseConnected = await checkDatabaseConnection();

  if (!databaseConnected) {
    return fallbackScheduleItems;
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
    ORDER BY start_time ASC`,
  );

  return result.rows;
}
