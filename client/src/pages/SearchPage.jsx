import { useState } from "react";
import SearchResultsSection from "../components/search/SearchResultsSection.jsx";
import { getSuggestedVideos } from "../utils/videoSuggestions.js";

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
  const [searchTerm, setSearchTerm] = useState(query);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const suggestedVideos = getSuggestedVideos(query);
  const totalResults =
    suggestedVideos.length +
    results.links.length +
    results.faqEntries.length +
    results.curriculumReferences.length +
    results.contentDocuments.length;

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await onSearch?.(trimmedSearchTerm);
      setStatus("success");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  }

  return (
    <section className="search-page" aria-labelledby="search-page-heading">
      <p className="eyebrow">Student search</p>
      <h1 id="search-page-heading">Search the Student Hub</h1>
      <p>
        Search links and debugging FAQ entries from one place, then open the
        result that matches what you need.
      </p>
      <a href="#dashboard">Back to dashboard</a>
      <form onSubmit={handleSubmit}>
        <label htmlFor="student-hub-search">Search the student hub</label>
        <input
          id="student-hub-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {query ? (
        <>
          <div className="search-results-summary" aria-label="Search summary">
            <span className="status-pill">You searched for {query}</span>
            <span className="status-pill">{totalResults} total matches</span>
            <span className="status-pill">{results.links.length} links</span>
            <span className="status-pill">{results.faqEntries.length} FAQ</span>
            <span className="status-pill">
              {results.curriculumReferences.length} curriculum
            </span>
            <span className="status-pill">
              {results.contentDocuments.length} docs
            </span>
            <span className="status-pill">{suggestedVideos.length} videos</span>
          </div>
          {status === "loading" ? <p>Loading search results...</p> : null}
          {status === "error" ? <p>{errorMessage}</p> : null}
          {status !== "loading" && status !== "error" ? (
            <div className="search-results-grid">
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
          ) : null}
          {status !== "loading" && status !== "error" && totalResults === 0 ? (
            <p>No results found for {query}</p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
