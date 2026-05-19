export default function SearchResultsSection({
  id,
  title,
  items,
  emptyLabel,
  renderItem,
  className = "",
}) {
  return (
    <section
      id={id}
      className={`search-results-section ${className}`.trim()}
      aria-labelledby={`${id}-heading`}
    >
      <div className="search-results-section-header">
        <h2 id={`${id}-heading`}>{title}</h2>
        <span className="search-results-count">{items.length}</span>
      </div>

      {items.length ? (
        <div className="search-results-list">
          {items.map(renderItem)}
        </div>
      ) : (
        <p className="empty-state">{emptyLabel}</p>
      )}
    </section>
  );
}
