import { checkDatabaseConnection, query } from "../config/db.js";
import { fallbackFaqEntries } from "../lib/fallbackData.js";

export async function listFaqEntries() {
  const databaseConnected = await checkDatabaseConnection();

  if (!databaseConnected) {
    return fallbackFaqEntries;
  }

  const result = await query(
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
    GROUP BY faq_entries.id
    ORDER BY faq_entries.category ASC, faq_entries.question ASC`,
  );

  return result.rows;
}
