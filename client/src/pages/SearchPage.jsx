import { useState } from "react";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");

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
        <p>You searched for {submittedSearchTerm}</p>
      ) : null}
    </section>
  );
}
