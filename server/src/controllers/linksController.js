import { listLinks } from "../models/linksModel.js";

export async function getLinks(req, res) {
  try {
    const links = await listLinks();

    res.json({ links });
  } catch {
    res.status(500).json({ error: "Unable to load links." });
  }
}
