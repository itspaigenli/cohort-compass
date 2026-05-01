import { listScheduleItems } from "../models/scheduleModel.js";

export async function listSchedule(req, res) {
  try {
    const scheduleItems = await listScheduleItems();

    res.json({
      scheduleItems,
    });
  } catch (error) {
    console.error("Error fetching schedule items:", error);

    res.status(500).json({ error: "Unable to fetch schedule items." });
  }
}
