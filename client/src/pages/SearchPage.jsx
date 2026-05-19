import { useState } from "react";
import SearchResultsSection from "../components/search/SearchResultsSection.jsx";
import { searchStudentHub } from "../services/searchApi.js";

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

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [results, setResults] = useState({
    links: [],
    faqEntries: [],
    curriculumReferences: [],
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const totalResults =
    results.links.length +
    results.faqEntries.length +
    results.curriculumReferences.length;

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      setSubmittedSearchTerm("");
      setResults({ links: [], faqEntries: [], curriculumReferences: [] });
      setStatus("idle");
      return;
    }

    setSubmittedSearchTerm(trimmedSearchTerm);
    setStatus("loading");
    setErrorMessage("");

    try {
      const searchResults = await searchStudentHub(trimmedSearchTerm);

      setResults({
        links: searchResults.links || [],
        faqEntries: searchResults.faqEntries || [],
        curriculumReferences: searchResults.curriculumReferences || [],
      });
      setStatus("success");
    } catch (error) {
      setErrorMessage(error.message);
      setResults({ links: [], faqEntries: [], curriculumReferences: [] });
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
      {submittedSearchTerm ? (
        <>
          <div className="search-results-summary" aria-label="Search summary">
            <span className="status-pill">You searched for {submittedSearchTerm}</span>
            <span className="status-pill">{totalResults} total matches</span>
            <span className="status-pill">{results.links.length} links</span>
            <span className="status-pill">{results.faqEntries.length} FAQ</span>
            <span className="status-pill">
              {results.curriculumReferences.length} curriculum
            </span>
          </div>
          {status === "loading" ? <p>Loading search results...</p> : null}
          {status === "error" ? <p>{errorMessage}</p> : null}
          {status === "success" ? (
            <div className="search-results-grid">
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
                id="search-faq"
                title="Debugging FAQ"
                items={results.faqEntries}
                emptyLabel="No FAQ entries matched your search."
                renderItem={renderFaqResult}
              />
            </div>
          ) : null}
          {status === "success" && totalResults === 0 ? (
            <p>No results found for {submittedSearchTerm}</p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
