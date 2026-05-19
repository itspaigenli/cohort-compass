import { getQueryTerms } from "./query.js";

export function includesQuery(values, searchTerm) {
  const terms = Array.isArray(searchTerm) ? searchTerm : getQueryTerms(searchTerm);

  if (!terms.length) {
    return true;
  }

  const haystack = values.map((value) => String(value || "").toLowerCase());

  return terms.every((term) =>
    haystack.some((value) => value.includes(term)),
  );
}

export function scoreField(value, terms, weight) {
  const normalized = String(value || "").toLowerCase();

  if (!normalized) {
    return 0;
  }

  let score = 0;

  for (const term of terms) {
    if (normalized === term) {
      score += weight + 5;
      continue;
    }

    if (normalized.includes(term)) {
      score += weight;
    }
  }

  return score;
}

export function scoreMatch(weightMap, query) {
  const terms = Array.isArray(query) ? query : getQueryTerms(query);

  if (!terms.length) {
    return 0;
  }

  const allValues = Object.values(weightMap).flat().map((entry) => entry.value);

  if (!includesQuery(allValues, terms)) {
    return -1;
  }

  let score = 0;

  for (const entries of Object.values(weightMap)) {
    for (const entry of entries) {
      score += scoreField(entry.value, terms, entry.weight);
    }
  }

  return score;
}

export function matchesPrimaryTerms(primaryEntries, query) {
  const terms = Array.isArray(query) ? query : getQueryTerms(query);

  if (!terms.length) {
    return true;
  }

  const values = primaryEntries.map((entry) => String(entry.value || "").toLowerCase());
  return includesQuery(values, terms);
}

export function uniqueBy(items, getKey) {
  const seen = new Set();

  return items.filter((item) => {
    const key = getKey(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

