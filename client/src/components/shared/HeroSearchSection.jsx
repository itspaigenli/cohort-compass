import SearchBar from "../dashboard/SearchBar.jsx";

export default function HeroSearchSection({
  title,
  query,
  onQueryChange,
  onSearch,
  backgroundSrc,
  buttonLabel = "Search student hub",
  backHref = "",
  description = "Search curriculum, documentation, debugging support, and program resources in one place.",
  placeholder = "Search docs, tools, debugging help, or a topic",
  ariaLabel = "Search docs, tools, debugging help, or a topic",
  kickerLabel = "Techtonica student hub",
  extraContent = null,
  secondaryActionLabel = "",
  secondaryActionHref = "",
  contextLinkLabel = "",
  contextLinkHref = "",
}) {
  return (
    <section className="compass-hero">
      <div className="compass-hero-background" aria-hidden="true">
        <img
          className="compass-hero-background-image"
          src={backgroundSrc}
          alt=""
        />
      </div>

      <div className="compass-hero-inner">
        <p className="item-meta compass-kicker">
          {backHref ? (
            <a className="hero-kicker-back-link" href={backHref} aria-label="Back to homepage">
              <i className="fa-solid fa-circle-left" aria-hidden="true" />
            </a>
          ) : null}
          <span>{kickerLabel}</span>
          {contextLinkLabel && contextLinkHref ? (
            <a className="hero-kicker-context-link" href={contextLinkHref}>
              {contextLinkLabel}
            </a>
          ) : null}
        </p>
        <h1 className="compass-hero-title">{title}</h1>
        <p className="compass-hero-copy">{description}</p>

        <div className="compass-hero-search-shell">
          <div className="compass-hero-search">
            <SearchBar
              onSearch={onSearch}
              placeholder={placeholder}
              ariaLabel={ariaLabel}
              showButton={false}
              value={query}
              onValueChange={onQueryChange}
            />
          </div>
        </div>

        {extraContent}

        <div className="compass-hero-actions search-page-actions">
          <button
            className="compass-primary-cta"
            type="button"
            onClick={() => onSearch(query)}
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
