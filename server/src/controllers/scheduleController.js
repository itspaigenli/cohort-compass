import { getGoogleCalendarScheduleItems } from "../lib/googleCalendar.js";
import { listScheduleItems } from "../models/scheduleModel.js";

export async function listSchedule(req, res) {
  try {
    const options = { date: req.query.date };
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
