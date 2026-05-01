import { fallbackLinks } from "../lib/fallbackData.js";
import { listLinks } from "../models/linksModel.js";

export async function getLinks(req, res) {
  try {
    const links = await listLinks();

    res.json({ links });
  } catch (error) {
    console.error("Error fetching important links:", error);

    res.json({
      links: fallbackLinks,
      source: "fallback",
    });
  }
}
