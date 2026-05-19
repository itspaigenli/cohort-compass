import {
  getContentDocumentBySlug,
  getContentDocuments,
} from "../lib/contentRepository.js";

export async function listContentDocuments() {
  return getContentDocuments();
}

export async function getContentDocument(slug) {
  return getContentDocumentBySlug(slug);
}
