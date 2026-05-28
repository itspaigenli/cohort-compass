import { useMemo, useState } from "react";
import FAQList from "../components/faq/FAQList.jsx";
import HeroSearchSection from "../components/shared/HeroSearchSection.jsx";
import heroBackground from "../assets/techtonica-hero-perplexity-cat.png";

const PRIMARY_FAQ_TOPICS = [
  "HTML",
  "CSS",
  "React + Vite",
  "Node & Express",
  "Testing",
];

const FAQ_CATEGORIES = [
  { label: "HTML", aliases: ["HTML"], keywords: ["html"] },
  { label: "CSS", aliases: ["CSS"], keywords: ["css"] },
  {
    label: "JavaScript Fundamentals",
    aliases: ["JavaScript Fundamentals", "JavaScript"],
    keywords: ["javascript", "undefined", "logic", "array", "loop", "conditional"],
  },
  {
    label: "React + Vite",
    aliases: ["React + Vite", "React"],
    keywords: ["react", "vite", "state", "useeffect", "component", "form submit"],
  },
  {
    label: "Node & Express",
    aliases: ["Node & Express"],
    keywords: ["node", "express", "route", "routing", "404", "backend"],
  },
  {
    label: "SQL & Postgres",
    aliases: ["SQL & Postgres"],
    keywords: ["sql", "postgres", "database", "query"],
  },
  {
    label: "Git & GitHub",
    aliases: ["Git & GitHub", "Git"],
    keywords: ["git", "github", "merge conflict", "branch", "remote"],
  },
  {
    label: "Testing",
    aliases: ["Testing"],
    keywords: ["test", "testing", "vitest", "rtl", "assert"],
  },
  {
    label: "Deployment",
    aliases: ["Deployment"],
    keywords: ["deployment", "render", "production"],
  },
  {
    label: "Workflows",
    aliases: ["Workflows", "workflows"],
    keywords: ["workflow", "git status", "branch sync", "setup flow"],
  },
  {
    label: "APIs",
    aliases: ["APIs"],
    keywords: ["api", "apis", "fetch", "cors", "request"],
  },
  {
    label: "Project Setup",
    aliases: ["Project Setup"],
    keywords: ["project setup", "env", "environment", "local project", "start"],
  },
  {
    label: "Pull Requests",
    aliases: ["Pull Requests"],
    keywords: ["pull request", "pr", "review", "review feedback"],
  },
];

function normalize(value = "") {
  return String(value || "").trim().toLowerCase();
}

function escapeRegExp(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesKeyword(haystack, keyword) {
  const normalizedHaystack = normalize(haystack);
  const normalizedKeyword = normalize(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedKeyword)}([^a-z0-9]|$)`, "i");
  return pattern.test(normalizedHaystack);
}

function matchesFaqTopic(entry, activeCategory) {
  if (!activeCategory) {
    return true;
  }

  const categoryConfig = FAQ_CATEGORIES.find((category) => category.label === activeCategory);

  if (!categoryConfig) {
    return true;
  }

  const haystackFields = [
    entry.category,
    entry.error_topic,
    entry.question,
    ...(entry.tags || []),
  ];

  return (
    categoryConfig.aliases.some((alias) => normalize(alias) === normalize(entry.category)) ||
    categoryConfig.keywords.some((keyword) =>
      haystackFields.some((field) => includesKeyword(field, keyword)),
    )
  );
}

function filterFaqEntries(entries, query = "") {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return entries;
  }

  return entries.filter((entry) =>
    [entry.question, entry.answer, entry.error_topic, entry.category, ...(entry.tags || [])]
      .map((value) => normalize(value))
      .some((value) => value.includes(normalizedQuery)),
  );
}

function scrollToFaqResults() {
  const resultsSection = document.getElementById("faq-results");

  if (!resultsSection || typeof resultsSection.scrollIntoView !== "function") {
    return;
  }

  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function FAQPage({ faqEntries, query }) {
  const [faqQuery, setFaqQuery] = useState(query || "");
  const [activeCategory, setActiveCategory] = useState("");
  const [showAllTopics, setShowAllTopics] = useState(false);
  const categories = useMemo(() => FAQ_CATEGORIES, []);
  const hasQuery = normalize(faqQuery).length > 0;
  const filteredEntries = filterFaqEntries(faqEntries, faqQuery).filter((entry) =>
    matchesFaqTopic(entry, activeCategory),
  );
  const visibleEntries = hasQuery ? filteredEntries : [];
  const primaryCategories = categories.filter((category) => PRIMARY_FAQ_TOPICS.includes(category.label));
  const secondaryCategories = categories.filter((category) => !PRIMARY_FAQ_TOPICS.includes(category.label));

  return (
    <div className="page-stack compass-home faq-page perplexity-inspired-home">
      <HeroSearchSection
        title="Debugging FAQ"
        query={faqQuery}
        onQueryChange={setFaqQuery}
        onSearch={scrollToFaqResults}
        backgroundSrc={heroBackground}
        backHref="#dashboard"
        buttonLabel="Browse Answers"
        description="Find common coding blockers, workflow issues, and troubleshooting guidance across the topics Techtonica students use every week."
        placeholder="Search errors, concepts, or troubleshooting topics"
        ariaLabel="Search FAQ questions and answers"
        extraContent={(
          <div className="faq-inline-filters faq-hero-filters">
            <p className="item-meta faq-inline-filters-label">Browse by topic</p>
            <div className="faq-chip-row" role="tablist" aria-label="FAQ categories">
              {primaryCategories.map((category) => (
                <button
                  key={category.label}
                  type="button"
                  className={activeCategory === category.label ? "faq-chip active" : "faq-chip"}
                  aria-pressed={activeCategory === category.label}
                  onClick={() =>
                    setActiveCategory((current) =>
                      current === category.label ? "" : category.label,
                    )
                  }
                >
                  {category.label}
                </button>
              ))}
              <button
                type="button"
                className={`faq-chip faq-chip-secondary${showAllTopics ? " active" : ""}`}
                onClick={() => setShowAllTopics((current) => !current)}
                aria-expanded={showAllTopics}
              >
                {showAllTopics ? "Fewer topics" : "More topics"}
              </button>
            </div>
            {showAllTopics ? (
              <div className="faq-chip-row faq-chip-row-expanded" aria-label="More FAQ categories">
                {secondaryCategories.map((category) => (
                  <button
                    key={category.label}
                    type="button"
                    className={activeCategory === category.label ? "faq-chip active" : "faq-chip"}
                    aria-pressed={activeCategory === category.label}
                    onClick={() =>
                      setActiveCategory((current) =>
                        current === category.label ? "" : category.label,
                      )
                    }
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      />

      <section className="faq-detail-grid" id="faq-results">
        <section className="panel faq-results-panel">
          <a className="faq-results-return-link" href="#search">
            Back to search
          </a>
          <div className="search-page-summary faq-page-summary faq-results-summary" aria-label="FAQ summary">
            <h2 className="faq-results-inline-title">Results</h2>
          </div>
          <FAQList
            entries={visibleEntries}
            emptyLabel={
              hasQuery
                ? "No FAQ entries match this filter yet."
                : "Search for a keyword to see matching FAQ entries."
            }
          />
        </section>
      </section>

      <button
        className="search-back-to-top"
        type="button"
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <i className="fa-solid fa-circle-arrow-up" aria-hidden="true" />
      </button>
    </div>
  );
}
