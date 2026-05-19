import { getJson } from "./api.js";

export async function fetchCurriculumReferences() {
  const data = await getJson("/curriculum");

  return data.curriculumReferences || [];
}
