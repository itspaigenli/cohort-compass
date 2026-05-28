import { getCurriculumReferences } from "../lib/curriculumRepository.js";

export async function listCurriculumReferences() {
  return getCurriculumReferences();
}
