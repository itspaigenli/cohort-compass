import { getGoogleCalendarScheduleItems } from "../lib/googleCalendar.js";
import { listScheduleItems } from "../models/scheduleModel.js";

function isValidDateFilter(date) {
  return !date || /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export async function listSchedule(req, res) {
  try {
    const options = { date: req.query.date };

    if (!isValidDateFilter(options.date)) {
      res.status(400).json({ error: "Date must use YYYY-MM-DD format." });
      return;
    }

    const calendarScheduleItems = await getGoogleCalendarScheduleItems(options);
    const scheduleItems = calendarScheduleItems || await listScheduleItems(options);

    res.json({
      scheduleItems,
    });
  } catch (error) {
    console.error("Error fetching schedule items:", error);

    res.status(500).json({ error: "Unable to fetch schedule items." });
  }
}
