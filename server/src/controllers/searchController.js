import { searchLinksAndFaq } from "../models/searchModel.js";

export async function searchContent(req, res) {
  try {
    const results = await searchLinksAndFaq(req.query.q || "");

    res.json(results);
  } catch (error) {
    console.error("Error searching Cohort Compass content:", error);

    res.status(500).json({ error: "Unable to search Cohort Compass content." });
  }
}
