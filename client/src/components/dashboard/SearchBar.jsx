import { useState } from "react";

export default function SearchBar({
  value,
  onValueChange,
  onSearch,
  placeholder = "Search docs, tools, debugging help, or a topic",
  ariaLabel = "Search docs, tools, debugging help, or a topic",
  showButton = true,
}) {
  const [localValue, setLocalValue] = useState("");
  const currentValue = value ?? localValue;

  function handleChange(nextValue) {
    if (value === undefined) {
      setLocalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSearch?.(currentValue.trim());
  }

  return (
    <form
      className={`hero-search${showButton ? "" : " hero-search-no-button"}`}
      onSubmit={handleSubmit}
    >
      <input
        type="search"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={currentValue}
        onChange={(event) => handleChange(event.target.value)}
      />
      {showButton ? <button type="submit">Search</button> : null}
    </form>
  );
}
