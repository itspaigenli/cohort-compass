import { curatedVideoTopics } from "../data/videoResources.js";

const topicAliases = {
  api: "api",
  apis: "api",
  backend: "api",
  css: "css",
  express: "api",
  git: "git",
  github: "git",
  html: "html",
  javascript: "javascript",
  js: "javascript",
  node: "api",
  postgres: "sql",
  postgresql: "sql",
  react: "react",
  reactjs: "react",
  sql: "sql",
  testing: "testing",
  useeffect: "react",
  usestate: "react",
  vitest: "testing",
};

function getSearchTerms(query = "") {
  return String(query)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export function getSuggestedVideos(query = "") {
  const matchedTopics = [
    ...new Set(getSearchTerms(query).map((term) => topicAliases[term]).filter(Boolean)),
  ];

  return matchedTopics.flatMap((topic) => curatedVideoTopics[topic] || []);
}
