const DEFAULT_STOP_WORDS = new Set([
  "a",
  "an",
  "about",
  "and",
  "can",
  "do",
  "for",
  "get",
  "help",
  "how",
  "i",
  "in",
  "is",
  "learn",
  "me",
  "my",
  "need",
  "of",
  "on",
  "or",
  "please",
  "show",
  "teach",
  "tell",
  "the",
  "to",
  "want",
  "with",
]);

const DEFAULT_ALIASES = {
  api: "api",
  apis: "api",
  backend: "api",
  branch: "git",
  branching: "git",
  cli: "command-line",
  coding: "code",
  challenges: "challenge",
  confidence: "confidence",
  css: "css",
  express: "api",
  git: "git",
  github: "git",
  hook: "react",
  hooks: "react",
  html: "html",
  interviews: "interview",
  javascript: "javascript",
  jest: "testing",
  js: "javascript",
  jsx: "react",
  node: "api",
  postgresql: "sql",
  postgres: "sql",
  pr: "git",
  prs: "pr",
  react: "react",
  reactjs: "react",
  rtl: "testing",
  sql: "sql",
  state: "react",
  testing: "testing",
  tests: "testing",
  useeffect: "react",
  usestate: "react",
  vitest: "testing",
};

const DEFAULT_INTENT_TAXONOMY = [
  {
    patterns: [
      "passing technical interviews",
      "pass technical interviews",
      "technical interview",
      "technical interviews",
      "interview prep",
      "interview preparation",
    ],
    terms: ["mock interview", "technical interview"],
    suppressPatternTerms: true,
  },
  {
    patterns: ["confidence building", "build confidence", "more confidence", "imposter syndrome"],
    terms: ["confidence building"],
  },
  {
    patterns: ["conflict resolution", "resolve conflict", "difficult conversation", "team conflict"],
    terms: ["conflict resolution", "collaboration"],
  },
  {
    patterns: ["public speaking", "presentation skills", "speaking confidence"],
    terms: ["public speaking"],
  },
  {
    patterns: ["soft skills", "professional skills"],
    terms: ["soft skills"],
  },
  {
    patterns: ["pair programming", "working with others", "working together"],
    terms: ["pair programming", "collaboration"],
  },
  {
    patterns: ["final project", "production environment"],
    terms: ["final project"],
  },
];

export function normalizeSearchTerm(term = "") {
  return term
    .toLowerCase()
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, "")
    .replace(/[_/]+/g, "-")
    .replace(/ies$/i, "y")
    .replace(/ing$/i, "")
    .replace(/es$/i, "")
    .replace(/s$/i, "");
}

export function getQueryTerms(value = "", options = {}) {
  const stopWords = options.stopWords || DEFAULT_STOP_WORDS;
  const aliases = options.aliases || DEFAULT_ALIASES;
  const intentTaxonomy = options.intentTaxonomy || DEFAULT_INTENT_TAXONOMY;
  const includeBigrams = options.includeBigrams || false;
  const normalizedQuery = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s/_-]+/g, " ");
  const baseTerms = normalizedQuery.split(/\s+/).filter(Boolean);
  const expandedTerms = new Set();
  const ignoredTerms = new Set();

  for (const intent of intentTaxonomy) {
    if (!intent.patterns.some((pattern) => normalizedQuery.includes(pattern))) {
      continue;
    }

    intent.terms.forEach((term) => expandedTerms.add(term));

    if (intent.suppressPatternTerms) {
      intent.patterns.forEach((pattern) => {
        pattern
          .split(/\s+/)
          .map((term) => normalizeSearchTerm(term))
          .filter(Boolean)
          .forEach((term) => ignoredTerms.add(term));
      });
    }
  }

  for (const term of baseTerms) {
    const normalized = normalizeSearchTerm(term);

    if (!normalized || stopWords.has(term) || ignoredTerms.has(normalized)) {
      continue;
    }

    expandedTerms.add(aliases[term] || normalized || term);
  }

  if (!includeBigrams || baseTerms.length < 2) {
    return [...expandedTerms];
  }

  const terms = [...expandedTerms];
  const seen = new Set(terms);

  for (let index = 0; index < baseTerms.length - 1; index += 1) {
    const phrase = `${normalizeSearchTerm(baseTerms[index])}-${normalizeSearchTerm(baseTerms[index + 1])}`;

    if (phrase && !seen.has(phrase)) {
      seen.add(phrase);
      terms.push(phrase);
    }
  }

  return terms;
}
