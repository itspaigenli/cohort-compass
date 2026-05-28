import { useState } from "react";
import SearchResultsSection from "../components/search/SearchResultsSection.jsx";
import HeroSearchSection from "../components/shared/HeroSearchSection.jsx";
import { getSuggestedVideos } from "../utils/videoSuggestions.js";
import heroBackground from "../assets/techtonica-hero-perplexity-cat.png";

const searchSectionTargets = {
  links: "search-links",
  faq: "search-faq",
  curriculum: "search-curriculum",
  docs: "search-docs",
};

function openResultCard(url) {
  if (!url) {
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function handleCardKeyDown(event, url) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  openResultCard(url);
}

function scrollToSearchSection(sectionId) {
  const section = document.getElementById(sectionId);

  if (!section) {
    return;
  }

  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderVideoItem(item) {
  return (
    <article
      key={item.id}
      className="mini-card search-result-card search-result-card-clickable"
      role="link"
      tabIndex={0}
      onClick={() => openResultCard(item.url)}
      onKeyDown={(event) => handleCardKeyDown(event, item.url)}
    >
      <p className="item-meta">{item.topic}</p>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <span className="search-result-link-label">Open YouTube results</span>
    </article>
  );
}

function renderLinkItem(item) {
  return (
    <article
      key={item.id}
      className="mini-card search-result-card search-result-card-clickable"
      role="link"
      tabIndex={0}
      onClick={() => openResultCard(item.url)}
      onKeyDown={(event) => handleCardKeyDown(event, item.url)}
    >
      <p className="item-meta">{item.category}</p>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <span className="search-result-link-label">Open link</span>
    </article>
  );
}

function renderCurriculumItem(item) {
  return (
    <article
      key={item.slug}
      className="mini-card search-result-card search-result-card-clickable"
      role="link"
      tabIndex={0}
      onClick={() => openResultCard(item.url)}
      onKeyDown={(event) => handleCardKeyDown(event, item.url)}
    >
      <p className="item-meta">{item.relativePath}</p>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <span className="search-result-link-label">Open curriculum reference</span>
    </article>
  );
}

function renderContentDocumentItem(item) {
  return (
    <article
      key={item.slug}
      className="mini-card search-result-card search-result-card-clickable"
      role="link"
      tabIndex={0}
      onClick={() => openResultCard(item.repoUrl)}
      onKeyDown={(event) => handleCardKeyDown(event, item.repoUrl)}
    >
      <p className="item-meta">{item.relativePath}</p>
      <h3>{item.title}</h3>
      <p>{item.summary || item.excerpt}</p>
      <div className="tag-row">
        {(item.tags || []).slice(0, 4).map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>
      <span className="search-result-link-label">Open markdown source</span>
      {item.sourceFileUrl ? (
        <a
          href={item.sourceFileUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          Open original source file
        </a>
      ) : null}
    </article>
  );
}

function renderFaqItem(item) {
  return (
    <article key={item.id} className="mini-card search-result-card search-result-card-faq">
      <p className="item-meta">{item.category}</p>
      <h3>{item.question}</h3>
      <p>{item.answer}</p>
      {item.error_topic ? (
        <div className="tag-row">
          <span className="tag-chip search-faq-tag-chip">{item.error_topic}</span>
        </div>
      ) : null}
      <a href="#faq">Browse full FAQ</a>
    </article>
  );
}

export default function SearchPage({ results, query, onSearch }) {
  const currentQuery = query || "";
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [sectionOpenSignals, setSectionOpenSignals] = useState({});
  const hasQuery = currentQuery.trim().length > 0;
  const suggestedVideos = getSuggestedVideos(currentQuery);
  const visibleSuggestedVideos = hasQuery ? suggestedVideos : [];
  const visibleLinks = hasQuery ? results.links : [];
  const visibleFaqEntries = hasQuery ? results.faqEntries : [];
  const visibleCurriculumReferences = hasQuery ? results.curriculumReferences : [];
  const visibleContentDocuments = hasQuery ? results.contentDocuments : [];
  const totalResults =
    visibleSuggestedVideos.length +
    visibleLinks.length +
    visibleFaqEntries.length +
    visibleCurriculumReferences.length +
    visibleContentDocuments.length;

  function handleSummaryJump(sectionKey) {
    const nextSectionId = searchSectionTargets[sectionKey];

    setSectionOpenSignals((current) => ({
      ...current,
      [sectionKey]: (current[sectionKey] || 0) + 1,
    }));

    window.requestAnimationFrame(() => {
      scrollToSearchSection(nextSectionId);
    });
  }

  return (
    <div className="page-stack compass-home search-page perplexity-inspired-home">
      <HeroSearchSection
        title="Search the Student Hub"
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSearch={onSearch}
        backgroundSrc={heroBackground}
        backHref="#dashboard"
        buttonLabel="Search"
      />

      <section className="compass-calendar-band search-results-band">
        {hasQuery ? (
          <div className="search-page-summary search-results-summary" aria-label="Search summary">
            <span className="status-pill">{`Results for "${currentQuery}"`}</span>
            <span className="status-pill">{totalResults} total matches</span>
            <button
              className="status-pill search-summary-link"
              type="button"
              onClick={() => handleSummaryJump("links")}
            >
              {results.links.length} links
            </button>
            <button
              className="status-pill search-summary-link"
              type="button"
              onClick={() => handleSummaryJump("faq")}
            >
              {results.faqEntries.length} faq
            </button>
            <button
              className="status-pill search-summary-link"
              type="button"
              onClick={() => handleSummaryJump("curriculum")}
            >
              {results.curriculumReferences.length} curriculum
            </button>
            <button
              className="status-pill search-summary-link"
              type="button"
              onClick={() => handleSummaryJump("docs")}
            >
              {results.contentDocuments.length} docs
            </button>
          </div>
        ) : null}

        <div className="search-grid">
          <SearchResultsSection
            id="search-videos"
            title="Suggested Videos"
            items={visibleSuggestedVideos}
            emptyLabel="No curated video suggestions yet."
            renderItem={renderVideoItem}
          />

          <SearchResultsSection
            id={searchSectionTargets.links}
            title="Links"
            items={visibleLinks}
            emptyLabel="No links yet."
            renderItem={renderLinkItem}
            openSignal={sectionOpenSignals.links}
          />

          <SearchResultsSection
            id={searchSectionTargets.curriculum}
            title="Techtonica Curriculum Repo"
            items={visibleCurriculumReferences}
            emptyLabel="No curriculum references yet."
            renderItem={renderCurriculumItem}
            openSignal={sectionOpenSignals.curriculum}
          />

          {hasQuery ? (
            <div className="search-column-stack">
              <SearchResultsSection
                id={searchSectionTargets.docs}
                title="Compass Content Docs"
                items={visibleContentDocuments}
                emptyLabel="No compass content docs yet."
                renderItem={renderContentDocumentItem}
                openSignal={sectionOpenSignals.docs}
              />

              <SearchResultsSection
                id={searchSectionTargets.faq}
                title="Debugging FAQ"
                items={visibleFaqEntries}
                emptyLabel="No FAQ matches yet."
                className="search-results-panel-faq"
                renderItem={renderFaqItem}
                openSignal={sectionOpenSignals.faq}
              />
            </div>
          ) : (
            <>
              <SearchResultsSection
                id={searchSectionTargets.docs}
                title="Compass Content Docs"
                items={visibleContentDocuments}
                emptyLabel="No compass content docs yet."
                renderItem={renderContentDocumentItem}
                openSignal={sectionOpenSignals.docs}
              />

              <SearchResultsSection
                id={searchSectionTargets.faq}
                title="Debugging FAQ"
                items={visibleFaqEntries}
                emptyLabel="No FAQ matches yet."
                className="search-results-panel-wide search-results-panel-faq"
                renderItem={renderFaqItem}
                openSignal={sectionOpenSignals.faq}
              />
            </>
          )}
        </div>
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
