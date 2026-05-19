import { listCurriculumReferences } from "../models/curriculumModel.js";

export async function getCurriculumReferences(req, res) {
  try {
    const references = await listCurriculumReferences();

    res.json({
      curriculumReferences: references,
    });
  } catch (error) {
    console.error("Error fetching curriculum references:", error);

    res.json({
      curriculumReferences: [],
    });
  }
}
