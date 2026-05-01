import { getJson } from "./api.js";

export async function fetchLinks() {
  const data = await getJson("/links");

  return data.links;
}
