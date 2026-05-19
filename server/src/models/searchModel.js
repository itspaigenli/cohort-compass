import { query } from "../config/db.js";
import { listContentDocuments } from "./contentModel.js";
import { listCurriculumReferences } from "./curriculumModel.js";

function matchesSearchTerm(value, searchTerm) {
  return String(value || "").toLowerCase().includes(searchTerm);
}

function filterCurriculumReferences(references, searchTerm) {
  return references.filter((reference) =>
    [
      reference.title,
      reference.relativePath,
      reference.summary,
      reference.kind,
    ].some((value) => matchesSearchTerm(value, searchTerm)),
  );
}

function filterContentDocuments(documents, searchTerm) {
  return documents.filter((document) =>
    [
      document.title,
      document.relativePath,
      document.summary,
      document.excerpt,
      document.section,
      document.category,
      document.topic,
    ].some((value) => matchesSearchTerm(value, searchTerm)),
  );
}

export async function searchLinksAndFaq(searchTerm) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return {
      links: [],
      faqEntries: [],
      curriculumReferences: [],
      contentDocuments: [],
    };
  }

  const searchPattern = `%${normalizedSearchTerm}%`;

  const linksResult = await query(
    `SELECT
      important_links.id,
      important_links.title,
      important_links.url,
      important_links.category,
      important_links.description,
      COALESCE(
        array_agg(tags.name ORDER BY tags.name)
          FILTER (WHERE tags.name IS NOT NULL),
        ARRAY[]::varchar[]
      ) AS tags
    FROM important_links
    LEFT JOIN important_link_tags
      ON important_link_tags.link_id = important_links.id
    LEFT JOIN tags
      ON tags.id = important_link_tags.tag_id
    WHERE
      LOWER(important_links.title) LIKE $1
      OR LOWER(important_links.category) LIKE $1
      OR LOWER(important_links.description) LIKE $1
      OR LOWER(tags.name) LIKE $1
    GROUP BY important_links.id
    ORDER BY important_links.is_featured DESC, important_links.title ASC`,
    [searchPattern],
  );

  const faqResult = await query(
    `SELECT
      faq_entries.id,
      faq_entries.question,
      faq_entries.answer,
      faq_entries.error_topic,
      faq_entries.category,
      COALESCE(
        array_agg(tags.name ORDER BY tags.name)
          FILTER (WHERE tags.name IS NOT NULL),
        ARRAY[]::varchar[]
      ) AS tags
    FROM faq_entries
    LEFT JOIN faq_tags
      ON faq_tags.faq_entry_id = faq_entries.id
    LEFT JOIN tags
      ON tags.id = faq_tags.tag_id
    WHERE
      LOWER(faq_entries.question) LIKE $1
      OR LOWER(faq_entries.answer) LIKE $1
      OR LOWER(faq_entries.error_topic) LIKE $1
      OR LOWER(faq_entries.category) LIKE $1
      OR LOWER(tags.name) LIKE $1
    GROUP BY faq_entries.id
    ORDER BY faq_entries.category ASC, faq_entries.question ASC`,
    [searchPattern],
  );
  const curriculumReferences = await listCurriculumReferences();
  const contentDocuments = await listContentDocuments();

  return {
    links: linksResult.rows,
    faqEntries: faqResult.rows,
    curriculumReferences: filterCurriculumReferences(
      curriculumReferences,
      normalizedSearchTerm,
    ),
    contentDocuments: filterContentDocuments(contentDocuments, normalizedSearchTerm),
  };
}
