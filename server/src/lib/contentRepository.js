import { promises as fs } from "fs";
import path from "path";

const CONTENT_ROOT =
  process.env.COMPASS_CONTENT_PATH ||
  "/Users/nessali/Desktop/GitHub/compass-content";
const DOCS_ROOT = path.join(CONTENT_ROOT, "docs");
const CONTENT_REPO_BASE =
  process.env.COMPASS_CONTENT_REPO_BASE ||
  "https://github.com/itspaigenli/compass-content/blob/main";

async function getMarkdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getMarkdownFiles(entryPath);
      }

      return entry.name.endsWith(".md") ? [entryPath] : [];
    }),
  );

  return files.flat();
}

function parseFrontmatter(source) {
  if (!source.startsWith("---\n")) {
    return { metadata: {}, body: source.trim() };
  }

  const endIndex = source.indexOf("\n---\n", 4);

  if (endIndex === -1) {
    return { metadata: {}, body: source.trim() };
  }

  const rawFrontmatter = source.slice(4, endIndex);
  const body = source.slice(endIndex + 5).trim();
  const metadata = {};

  rawFrontmatter.split("\n").forEach((line) => {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      return;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

    metadata[key] = value;
  });

  return { metadata, body };
}

function createExcerpt(body) {
  return body
    .replace(/^#+\s/gm, "")
    .replace(/^- /gm, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, 220);
}

function createSlug(filePath) {
  return path.relative(DOCS_ROOT, filePath).replace(/\.md$/, "").replace(/\\/g, "/");
}

function createDocumentRecord(filePath, source) {
  const relativeDocPath = path.relative(DOCS_ROOT, filePath).replace(/\\/g, "/");
  const { metadata, body } = parseFrontmatter(source);
  const slug = createSlug(filePath);

  return {
    slug,
    relativePath: `docs/${relativeDocPath}`,
    title: metadata.title || path.basename(filePath, ".md"),
    section: metadata.section || relativeDocPath.split("/")[0],
    category: metadata.category || "",
    topic: metadata.topic || "",
    summary: metadata.summary || "",
    body,
    excerpt: createExcerpt(body),
    repository: "compass-content",
    repoUrl: `${CONTENT_REPO_BASE}/docs/${relativeDocPath}`,
  };
}

export async function getContentDocuments() {
  try {
    const files = await getMarkdownFiles(DOCS_ROOT);
    const documents = await Promise.all(
      files.map(async (filePath) => {
        const source = await fs.readFile(filePath, "utf8");
        return createDocumentRecord(filePath, source);
      }),
    );

    return documents.sort((first, second) => first.title.localeCompare(second.title));
  } catch {
    return [];
  }
}

export async function getContentDocumentBySlug(slug) {
  const documents = await getContentDocuments();

  return documents.find((document) => document.slug === slug) || null;
}
