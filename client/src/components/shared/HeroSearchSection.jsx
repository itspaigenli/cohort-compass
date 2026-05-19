import SearchBar from "../dashboard/SearchBar.jsx";

export default function HeroSearchSection({
  title,
  query,
  onQueryChange,
  onSearch,
  backgroundSrc,
  description = "Search curriculum, documentation, debugging support, and program resources in one place.",
  kickerLabel = "Techtonica student hub",
  buttonLabel = "Search student hub",
  secondaryActionLabel = "",
  secondaryActionHref = "",
}) {
  return (
    <section className="compass-hero">
      <div className="compass-hero-background" aria-hidden="true">
        <img className="compass-hero-background-image" src={backgroundSrc} alt="" />
      </div>

      <div className="compass-hero-inner">
        <p className="item-meta compass-kicker">{kickerLabel}</p>
        <h1 className="compass-hero-title">{title}</h1>
        <p className="compass-hero-copy">{description}</p>

        <div className="compass-hero-search-shell">
          <div className="compass-hero-search">
            <SearchBar
              value={query}
              onValueChange={onQueryChange}
              onSearch={onSearch}
              showButton={false}
            />
          </div>
        </div>

        <div className="compass-hero-actions">
          <button
            className="compass-primary-cta"
            type="button"
            onClick={() => onSearch?.(query.trim())}
          >
            {buttonLabel}
          </button>
          {secondaryActionLabel && secondaryActionHref ? (
            <a className="compass-secondary-cta" href={secondaryActionHref}>
              {secondaryActionLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
