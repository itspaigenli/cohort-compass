import { query } from "../config/db.js";

export async function searchLinksAndFaq(searchTerm) {
  const searchPattern = `%${searchTerm.trim().toLowerCase()}%`;

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

  return {
    links: linksResult.rows,
    faqEntries: faqResult.rows,
  };
}
