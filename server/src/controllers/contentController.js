import {
  getContentDocument,
  listContentDocuments,
} from "../models/contentModel.js";

export async function listContent(req, res) {
  try {
    const contentDocuments = await listContentDocuments();

    res.json({ contentDocuments });
  } catch (error) {
    console.error("Error fetching content documents:", error);

    res.status(500).json({ error: "Unable to fetch content documents." });
  }
}

export async function getContent(req, res) {
  try {
    const document = await getContentDocument(req.query.slug || "");

    if (!document) {
      return res.status(404).json({ error: "Content document not found." });
    }

    res.json({ contentDocument: document });
  } catch (error) {
    console.error("Error fetching content document:", error);

    res.status(500).json({ error: "Unable to fetch content document." });
  }
}
