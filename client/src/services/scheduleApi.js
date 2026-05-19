import { getJson } from "./api.js";
import { normalizeScheduleItems } from "../utils/dateTime.js";

export async function fetchScheduleItems(options = {}) {
  const params = new URLSearchParams();

  if (options.date) {
    params.set("date", options.date);
  }

  const path = params.size ? `/schedule?${params.toString()}` : "/schedule";
  const data = await getJson(path);

  return normalizeScheduleItems(data.scheduleItems);
}
