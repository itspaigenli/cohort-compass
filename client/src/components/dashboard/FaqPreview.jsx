import { useState } from "react";

export default function FaqPreview({ faqEntries = [] }) {
  const [filterText, setFilterText] = useState("");
  const normalizedFilterText = filterText.trim().toLowerCase();
  const visibleFaqEntries = normalizedFilterText
    ? faqEntries.filter((entry) =>
        [entry.question, entry.answer, entry.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedFilterText),
      )
    : faqEntries;

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
