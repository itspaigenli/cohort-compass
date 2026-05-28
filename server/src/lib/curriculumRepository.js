const CURRICULUM_TREE_URL =
  "https://api.github.com/repos/Techtonica/curriculum/git/trees/main?recursive=1";
const CURRICULUM_BLOB_BASE =
  "https://github.com/Techtonica/curriculum/blob/main";
const CURRICULUM_TREE_BASE =
  "https://github.com/Techtonica/curriculum/tree/main";

const usefulTopLevelFolders = new Set([
  "api",
  "css",
  "databases",
  "debugging",
  "deploying",
  "express-js",
  "git",
  "html",
  "javascript",
  "node-js",
  "objectives",
  "react-js",
  "testing-and-tdd",
]);

function titleFromPath(repoPath) {
  const filename = repoPath.split("/").at(-1) || repoPath;
  const withoutExtension = filename.replace(/\.[^.]+$/, "");

  return withoutExtension
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function isUsefulCurriculumItem(item) {
  const topLevelFolder = item.path.split("/")[0];

  if (!usefulTopLevelFolders.has(topLevelFolder)) {
    return false;
  }

  return item.type === "tree" || item.path.endsWith(".md");
}

function formatCurriculumItem(item) {
  const urlBase = item.type === "tree" ? CURRICULUM_TREE_BASE : CURRICULUM_BLOB_BASE;

  return {
    slug: item.path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase(),
    title: titleFromPath(item.path),
    relativePath: item.path,
    summary: `Techtonica curriculum reference for ${item.path}.`,
    url: `${urlBase}/${item.path}`,
    kind: item.type === "tree" ? "directory" : "file",
  };
}

export async function getCurriculumReferences() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "cohort-compass",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(CURRICULUM_TREE_URL, { headers });

  if (!response.ok) {
    throw new Error("Unable to load Techtonica curriculum references.");
  }

  const data = await response.json();

  return (data.tree || [])
    .filter(isUsefulCurriculumItem)
    .slice(0, 100)
    .map(formatCurriculumItem);
}
