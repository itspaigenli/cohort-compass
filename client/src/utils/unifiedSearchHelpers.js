import {
  buildContentPrimaryEntries,
  buildContentWeightMap,
  buildCurriculumWeightMap,
  buildFaqWeightMap,
  buildLinkWeightMap,
  searchResultKeyBuilders,
} from "../../../shared/search/definitions.js";
import {
  matchesPrimaryTerms,
  scoreMatch,
  uniqueBy,
} from "../../../shared/search/engine.js";

export function buildLocalUnifiedSearchResults({
  query,
  links,
  faqEntries,
  contentDocuments,
  curriculumReferences,
}) {
  function rank(items, scoreBuilder, getTieBreaker) {
    return items
      .map((item) => ({
        item,
        score: scoreBuilder(item),
      }))
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return getTieBreaker(a.item).localeCompare(getTieBreaker(b.item));
      })
      .map((entry) => entry.item);
  }

  return {
    query,
    links: rank(
      links,
      (item) => scoreMatch(buildLinkWeightMap(item), query),
      (item) => item.title,
    ),
    faqEntries: rank(
      faqEntries,
      (item) => scoreMatch(buildFaqWeightMap(item), query),
      (item) => item.question,
    ),
    contentDocuments: rank(
      contentDocuments,
      (item) => {
        const primaryEntries = buildContentPrimaryEntries(item);

        if (!matchesPrimaryTerms(primaryEntries, query)) {
          return -1;
        }

        return scoreMatch(buildContentWeightMap(item), query);
      },
      (item) => item.title,
    ),
    curriculumReferences: rank(
      curriculumReferences,
      (item) => scoreMatch(buildCurriculumWeightMap(item), query),
      (item) => item.title,
    ),
  };
}

export function mergeUnifiedSearchResults(primary, fallback) {
  return {
    query: primary.query || fallback.query,
    links: uniqueBy([...(primary.links || []), ...(fallback.links || [])], searchResultKeyBuilders.links),
    faqEntries: uniqueBy(
      [...(primary.faqEntries || []), ...(fallback.faqEntries || [])],
      searchResultKeyBuilders.faqEntries,
    ),
    contentDocuments: uniqueBy(
      [...(primary.contentDocuments || []), ...(fallback.contentDocuments || [])],
      searchResultKeyBuilders.contentDocuments,
    ),
    curriculumReferences: uniqueBy(
      [...(primary.curriculumReferences || []), ...(fallback.curriculumReferences || [])],
      searchResultKeyBuilders.curriculumReferences,
    ),
  };
}
