import { getJson } from "./api.js";
import { normalizeScheduleItems } from "../utils/dateTime.js";

export async function fetchScheduleItems() {
  const data = await getJson("/schedule");

  return normalizeScheduleItems(data.scheduleItems);
}
