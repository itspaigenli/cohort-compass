import { normalizeScheduleItems } from "../utils/dateTime.js";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchScheduleItems() {
  const response = await fetch(`${API_URL}/schedule`);

  if (!response.ok) {
    throw new Error("Failed to fetch schedule items.");
  }

  const data = await response.json();

  return normalizeScheduleItems(data.scheduleItems);
}
