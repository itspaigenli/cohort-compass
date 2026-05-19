import { getJson } from "./api.js";
import { normalizeScheduleItems } from "../utils/dateTime.js";
import { mockScheduleItems } from "../data/mockData.js";

export async function fetchScheduleItems() {
  const data = await getJson("/schedule", { scheduleItems: mockScheduleItems });

  return normalizeScheduleItems(data.scheduleItems);
}
