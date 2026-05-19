import { getJson } from "./api.js";

export async function searchStudentHub(searchTerm) {
  const data = await getJson(`/search?q=${encodeURIComponent(searchTerm)}`);

  return data;
}
