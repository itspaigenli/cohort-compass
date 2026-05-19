import FAQCard from "./FAQCard.jsx";

export default function FAQList({ entries, emptyLabel = "No FAQ entries yet." }) {
  if (!entries.length) {
    return <p className="empty-state faq-empty-state">{emptyLabel}</p>;
  }

  return (
    <div className="stack-list">
      {entries.map((entry) => (
        <FAQCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
