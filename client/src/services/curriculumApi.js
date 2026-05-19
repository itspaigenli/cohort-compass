import { getJson } from "./api.js";
import { mockCurriculumReferences } from "../data/mockData.js";

export async function fetchCurriculumReferences() {
  const data = await getJson("/curriculum", {
    curriculumReferences: mockCurriculumReferences,
  });

  return data.curriculumReferences || [];
}
