import { getJson } from "./api.js";
import { mockContentDocuments } from "../data/mockData.js";

export async function fetchContentDocuments() {
  const data = await getJson("/content", {
    contentDocuments: mockContentDocuments,
  });

  return data.contentDocuments || [];
}

export async function fetchContentDocument(slug) {
  const data = await getJson(`/content/doc?slug=${encodeURIComponent(slug)}`);

  return data.contentDocument;
}
