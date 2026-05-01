import { query } from "../config/db.js";

export async function listLinks() {
  const result = await query(
    `SELECT
      important_links.id,
      important_links.title,
      important_links.url,
      important_links.category,
      important_links.description,
      important_links.is_featured,
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
    GROUP BY important_links.id
    ORDER BY important_links.is_featured DESC, important_links.title ASC`,
  );

  return result.rows;
}
