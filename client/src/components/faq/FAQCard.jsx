export default function FAQCard({ entry }) {
  const visibleTags = [entry.error_topic, ...(entry.tags || [])].filter(Boolean).slice(0, 4);

  return (
    <details className="faq-card">
      <summary className="faq-summary">
        <div>
          <p className="item-meta">{entry.category}</p>
          <h3>{entry.question}</h3>
        </div>
        <span className="faq-toggle" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="faq-answer">
        <p>{entry.answer}</p>
        {visibleTags.length ? (
          <div className="tag-row">
            {visibleTags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {entry.url ? (
          <a href={entry.url} target="_blank" rel="noreferrer">
            {entry.link_label || "Open source"}
          </a>
        ) : null}
      </div>
    </details>
  );
}
