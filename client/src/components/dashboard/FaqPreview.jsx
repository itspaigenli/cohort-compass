import { useEffect, useState } from "react";
import { fetchFaqEntries } from "../../services/faqApi.js";

export default function FaqPreview() {
  const [faqEntries, setFaqEntries] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const normalizedFilterText = filterText.trim().toLowerCase();
  const visibleFaqEntries = normalizedFilterText
    ? faqEntries.filter((entry) =>
        [entry.question, entry.answer, entry.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedFilterText),
      )
    : faqEntries;

  useEffect(() => {
    async function loadFaqEntries() {
      try {
        const entries = await fetchFaqEntries();

        setFaqEntries(entries);
        setStatus("success");
      } catch (error) {
        setErrorMessage(error.message);
        setStatus("error");
      }
    }

    loadFaqEntries();
  }, []);

  if (status === "loading") {
    return <p>Loading FAQ...</p>;
  }

  if (status === "error") {
    return <p>{errorMessage}</p>;
  }

  if (!faqEntries.length) {
    return <p>No FAQ entries yet.</p>;
  }

  return (
    <>
      <label htmlFor="faq-filter">Filter FAQ entries</label>
      <input
        id="faq-filter"
        type="search"
        value={filterText}
        onChange={(event) => setFilterText(event.target.value)}
      />
      <ul>
        {visibleFaqEntries.map((entry) => (
          <li key={entry.id}>
            <h3>{entry.question}</h3>
            <p>{entry.answer}</p>
            <p>{entry.category}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
