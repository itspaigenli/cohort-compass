import { getJson } from "./api.js";

export async function fetchFaqEntries() {
  const data = await getJson("/faq");

  return data.faqEntries;
}
