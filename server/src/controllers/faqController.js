import { fallbackFaqEntries } from "../lib/fallbackData.js";
import { listFaqEntries } from "../models/faqModel.js";

export async function getFaqEntries(req, res) {
  try {
    const faqEntries = await listFaqEntries();

    res.json({ faqEntries });
  } catch (error) {
    console.error("Error fetching FAQ entries:", error);

    res.json({
      faqEntries: fallbackFaqEntries,
      source: "fallback",
    });
  }
}
