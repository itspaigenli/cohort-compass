import { getJson } from "./api.js";
import { mockFaqEntries } from "../data/mockData.js";

export async function fetchFaqEntries() {
  const data = await getJson("/faq", { faqEntries: mockFaqEntries });

  return data.faqEntries;
}
