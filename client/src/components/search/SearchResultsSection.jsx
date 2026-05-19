import { useEffect, useState } from "react";

const MOBILE_COLLAPSE_BREAKPOINT = 640;

function useCompactSearchLayout() {
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= MOBILE_COLLAPSE_BREAKPOINT : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    function handleResize() {
      setIsCompact(window.innerWidth <= MOBILE_COLLAPSE_BREAKPOINT);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isCompact;
}

export default function SearchResultsSection({
  id,
  title,
  items,
  emptyLabel,
  renderItem,
  className = "",
  openSignal = 0,
}) {
  const isCompact = useCompactSearchLayout();
  const [openState, setOpenState] = useState({
    key: "",
    open: false,
    signal: 0,
  });
  const sectionKey = `${id}:${title}:${items.length}`;
  const signalOpensSection = openSignal > 0 && openState.signal !== openSignal;
  const isOpen =
    !isCompact ||
    signalOpensSection ||
    (openState.key === sectionKey && openState.open);

  if (!isCompact) {
    return (
      <section id={id} className={`panel search-results-panel ${className}`.trim()}>
        <div className="panel-header">
          <h2>{title}</h2>
          <span className="status-pill">{items.length}</span>
        </div>
        {items.length ? (
          <div className="stack-list">
            {items.map(renderItem)}
          </div>
        ) : (
          <p className="empty-state">{emptyLabel}</p>
        )}
      </section>
    );
  }

  return (
    <section
      id={id}
      className={`panel search-results-panel search-results-panel-collapsible ${className}`.trim()}
    >
      <button
        type="button"
        className="panel-header search-results-summary-toggle"
        aria-expanded={isOpen}
        onClick={() =>
          setOpenState({
            key: sectionKey,
            open: !isOpen,
            signal: openSignal,
          })
        }
      >
        <h2>{title}</h2>
        <span className="search-results-summary-meta">
          <span className="status-pill">{items.length}</span>
          <i className="fa-solid fa-chevron-down search-results-toggle-icon" aria-hidden="true" />
        </span>
      </button>
      {isOpen ? items.length ? (
        <div className="stack-list">
          {items.map(renderItem)}
        </div>
      ) : (
        <p className="empty-state">{emptyLabel}</p>
      ) : null}
    </section>
  );
}
