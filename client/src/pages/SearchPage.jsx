import { useState } from "react";

const searchGroups = [
  {
    title: "Resources",
    items: [
      {
        title: "React Docs",
        description: "Official React documentation for components and hooks.",
        keywords: ["react", "hooks", "components"],
      },
      {
        title: "Program Links",
        description: "Common links students use during the cohort.",
        keywords: ["links", "resources", "program"],
      },
    ],
  },
  {
    title: "FAQ",
    items: [
      {
        title: "How do I manage React state?",
        description: "Use state when a component needs to remember changing data.",
        keywords: ["react", "state", "hooks"],
      },
      {
        title: "Where do I find debugging help?",
        description: "Start with the debugging FAQ and examples from class.",
        keywords: ["debugging", "errors", "faq"],
      },
    ],
  },
];

function getMatchingGroups(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return searchGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        [item.title, item.description, ...item.keywords]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      ),
    }))
    .filter((group) => group.items.length > 0);
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const matchingGroups = getMatchingGroups(submittedSearchTerm);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmittedSearchTerm(searchTerm);
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
          {matchingGroups.length > 0 ? (
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
          ) : (
            <p>No results found for {submittedSearchTerm}</p>
          )}
        </>
      ) : null}
    </section>
  );
}
