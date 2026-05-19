import { getJson } from "./api.js";
import { mockLinks } from "../data/mockData.js";

export async function fetchLinks() {
  const data = await getJson("/links", { links: mockLinks });

  return data.links;
}
