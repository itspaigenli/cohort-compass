import { useState } from "react";
import { searchStudentHub } from "../services/searchApi.js";

function buildSearchGroups(results) {
  const groups = [];

  if (results.links?.length) {
    groups.push({
      title: "Links",
      items: results.links.map((link) => ({
        title: link.title,
        description: link.description,
      })),
    });
  }

  if (results.faqEntries?.length) {
    groups.push({
      title: "FAQ",
      items: results.faqEntries.map((entry) => ({
        title: entry.question,
        description: entry.answer,
      })),
    });
  }

  return groups;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [matchingGroups, setMatchingGroups] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      setSubmittedSearchTerm("");
      setMatchingGroups([]);
      setStatus("idle");
      return;
    }

    setSubmittedSearchTerm(trimmedSearchTerm);
    setStatus("loading");
    setErrorMessage("");

    try {
      const results = await searchStudentHub(trimmedSearchTerm);

      setMatchingGroups(buildSearchGroups(results));
      setStatus("success");
    } catch (error) {
      setErrorMessage(error.message);
      setMatchingGroups([]);
      setStatus("error");
    }
  }

  return (
    <section className="search-page" aria-labelledby="search-page-heading">
      <p className="eyebrow">Student search</p>
      <h1 id="search-page-heading">Search the Student Hub</h1>
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
          <p>You searched for {submittedSearchTerm}</p>
          {status === "loading" ? <p>Loading search results...</p> : null}
          {status === "error" ? <p>{errorMessage}</p> : null}
          {status === "success" && matchingGroups.length > 0 ? (
            <div>
              {matchingGroups.map((group) => {
                const headingId = `${group.title.toLowerCase()}-results-heading`;

                return (
                  <section key={group.title} aria-labelledby={headingId}>
                    <h2 id={headingId}>{group.title}</h2>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item.title}>
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          ) : null}
          {status === "success" && matchingGroups.length === 0 ? (
            <p>No results found for {submittedSearchTerm}</p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
