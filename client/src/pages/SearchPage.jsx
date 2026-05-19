import { useEffect, useState } from "react";
import heroBackground from "../assets/techtonica-hero-perplexity-cat.png";
import SearchResultsSection from "../components/search/SearchResultsSection.jsx";
import HeroSearchSection from "../components/shared/HeroSearchSection.jsx";
import { getSuggestedVideos } from "../utils/videoSuggestions.js";

const searchSections = [
  { key: "videos", label: "Videos", id: "search-videos" },
  { key: "links", label: "Links", id: "search-links" },
  { key: "curriculumReferences", label: "Curriculum", id: "search-curriculum" },
  { key: "contentDocuments", label: "Docs", id: "search-docs" },
  { key: "faqEntries", label: "FAQ", id: "search-faq" },
];

function openResultUrl(url) {
  if (!url) {
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function handleResultKeyDown(event, url) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  openResultUrl(url);
}

function renderLinkResult(link) {
  return (
    <article
      key={link.id}
      className="search-result-card search-result-card-clickable"
      role="link"
      tabIndex={0}
      onClick={() => openResultUrl(link.url)}
      onKeyDown={(event) => handleResultKeyDown(event, link.url)}
    >
      <p className="item-meta">{link.category}</p>
      <h3>{link.title}</h3>
      <p>{link.description}</p>
      <span className="search-result-link-label">Open link</span>
    </article>
  );
}

function renderFaqResult(entry) {
  return (
    <article key={entry.id} className="search-result-card">
      <p className="item-meta">{entry.category}</p>
      <h3>{entry.question}</h3>
      <p>{entry.answer}</p>
      {entry.error_topic ? (
        <span className="tag-chip">{entry.error_topic}</span>
      ) : null}
      <a href="#faq">Browse full FAQ</a>
    </article>
  );
}

function renderCurriculumResult(reference) {
  return (
    <article
      key={reference.slug}
      className="search-result-card search-result-card-clickable"
      role="link"
      tabIndex={0}
      onClick={() => openResultUrl(reference.url)}
      onKeyDown={(event) => handleResultKeyDown(event, reference.url)}
    >
      <p className="item-meta">{reference.relativePath}</p>
      <h3>{reference.title}</h3>
      <p>{reference.summary}</p>
      <span className="search-result-link-label">Open curriculum reference</span>
    </article>
  );
}

function renderVideoResult(video) {
  return (
    <article
      key={video.id}
      className="search-result-card search-result-card-clickable"
      role="link"
      tabIndex={0}
      onClick={() => openResultUrl(video.url)}
      onKeyDown={(event) => handleResultKeyDown(event, video.url)}
    >
      <p className="item-meta">{video.topic}</p>
      <h3>{video.title}</h3>
      <p>{video.description}</p>
      <span className="search-result-link-label">Open YouTube results</span>
    </article>
  );
}

function renderContentDocumentResult(document) {
  return (
    <article
      key={document.slug}
      className="search-result-card search-result-card-clickable"
      role="link"
      tabIndex={0}
      onClick={() => openResultUrl(document.repoUrl)}
      onKeyDown={(event) => handleResultKeyDown(event, document.repoUrl)}
    >
      <p className="item-meta">{document.relativePath}</p>
      <h3>{document.title}</h3>
      <p>{document.summary || document.excerpt}</p>
      <span className="search-result-link-label">Open markdown source</span>
    </article>
  );
}

export default function SearchPage({
  query = "",
  results = {
    links: [],
    faqEntries: [],
    curriculumReferences: [],
    contentDocuments: [],
  },
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState(query);
  const hasQuery = query.trim().length > 0;
  const suggestedVideos = hasQuery ? getSuggestedVideos(query) : [];
  const totalResults =
    suggestedVideos.length +
    results.links.length +
    results.faqEntries.length +
    results.curriculumReferences.length +
    results.contentDocuments.length;

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  function handleSearch(nextQuery) {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    onSearch?.(trimmedQuery);
  }

  function scrollToResultsSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="page-stack compass-home search-page">
      <HeroSearchSection
        title="Search the Student Hub"
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSearch={handleSearch}
        backgroundSrc={heroBackground}
        buttonLabel="Search"
        secondaryActionLabel="Back to dashboard"
        secondaryActionHref="#dashboard"
      />

      <section
        className="compass-calendar-band search-results-band"
        aria-labelledby="search-results-heading"
      >
        <div className="panel-header">
          <div>
            <p className="item-meta">Search results</p>
            <h2 id="search-results-heading">
              {hasQuery ? `Results for ${query}` : "Results will appear here"}
            </h2>
          </div>
          {hasQuery ? (
            <span className="status-pill">{totalResults} total matches</span>
          ) : null}
        </div>

        {hasQuery ? (
          <>
            <div className="search-results-summary" aria-label="Search summary">
              {searchSections.map((section) => {
                const sectionCount =
                  section.key === "videos"
                    ? suggestedVideos.length
                    : results[section.key].length;

                return (
                  <button
                    key={section.key}
                    className="search-summary-link"
                    type="button"
                    onClick={() => scrollToResultsSection(section.id)}
                  >
                    {section.label}: {sectionCount}
                  </button>
                );
              })}
            </div>

            <div className="search-grid">
              <SearchResultsSection
                id="search-videos"
                title="Suggested Videos"
                items={suggestedVideos}
                emptyLabel="No suggested videos matched your search."
                renderItem={renderVideoResult}
              />
              <SearchResultsSection
                id="search-links"
                title="Links"
                items={results.links}
                emptyLabel="No links matched your search."
                renderItem={renderLinkResult}
              />
              <SearchResultsSection
                id="search-curriculum"
                title="Techtonica Curriculum"
                items={results.curriculumReferences}
                emptyLabel="No curriculum references matched your search."
                renderItem={renderCurriculumResult}
              />
              <div className="search-column-stack">
                <SearchResultsSection
                  id="search-docs"
                  title="Compass Content Docs"
                  items={results.contentDocuments}
                  emptyLabel="No compass content docs matched your search."
                  renderItem={renderContentDocumentResult}
                />
                <SearchResultsSection
                  id="search-faq"
                  title="Debugging FAQ"
                  items={results.faqEntries}
                  emptyLabel="No FAQ entries matched your search."
                  renderItem={renderFaqResult}
                />
              </div>
            </div>

            {totalResults === 0 ? <p>No results found for {query}</p> : null}
          </>
        ) : (
          <p className="empty-state">
            Enter a topic above to search links, curriculum, docs, FAQ entries,
            and suggested videos.
          </p>
        )}
      </section>
    </div>
  );
}
