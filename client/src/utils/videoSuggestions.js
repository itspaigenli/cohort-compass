import { curatedVideoTopics } from "../data/videoResources.js";
import { getQueryTerms } from "../../../shared/search/query.js";

const topicAliases = {
  api: "api",
  apis: "api",
  backend: "api",
  branch: "git",
  branching: "git",
  html: "html",
  css: "css",
  javascript: "javascript",
  js: "javascript",
  hook: "react",
  hooks: "react",
  react: "react",
  reactjs: "react",
  state: "react",
  usestate: "react",
  useeffect: "react",
  git: "git",
  github: "git",
  "pull-request": "git",
  pr: "git",
  sql: "sql",
  postgresql: "sql",
  postgres: "sql",
  express: "api",
  node: "api",
  testing: "testing",
  vitest: "testing",
  rtl: "testing",
  jest: "testing",
};

export function getSuggestedVideos(query = "", topic = "") {
  const requested = [
    ...getQueryTerms(query, { includeBigrams: true }),
    ...getQueryTerms(topic, { includeBigrams: true }),
  ];
  const matchedTopics = [...new Set(requested.map((term) => topicAliases[term]).filter(Boolean))];

  if (!matchedTopics.length) {
    return [];
  }

  return matchedTopics.flatMap((matchedTopic) =>
    (curatedVideoTopics[matchedTopic] || []).map((video) => ({
      ...video,
      resource_type: "video",
      tags: [matchedTopic, "youtube", "supplemental-learning"],
      source_label: video.channel,
      link_label: "Open YouTube results",
    })),
  );
}
