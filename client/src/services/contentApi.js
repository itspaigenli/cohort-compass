import { getJson } from "./api.js";

export async function fetchContentDocuments() {
  const data = await getJson("/content");

  return data.contentDocuments || [];
}

export async function fetchContentDocument(slug) {
  const data = await getJson(`/content/doc?slug=${encodeURIComponent(slug)}`);

  return data.contentDocument;
}
