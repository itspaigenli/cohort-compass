export function buildLinkSearchValues(item) {
  return [item.title, item.description, item.category, ...(item.tags || [])];
}

export function buildFaqSearchValues(item) {
  return [item.question, item.answer, item.error_topic, item.category, ...(item.tags || [])];
}

export function buildLinkWeightMap(item) {
  return {
    primary: [
      { value: item.title, weight: 10 },
      { value: item.category, weight: 7 },
      ...(item.tags || []).map((tag) => ({ value: tag, weight: 8 })),
    ],
    secondary: [{ value: item.description, weight: 4 }],
  };
}

export function buildFaqWeightMap(item) {
  return {
    primary: [
      { value: item.question, weight: 11 },
      { value: item.error_topic, weight: 9 },
      { value: item.category, weight: 7 },
      ...(item.tags || []).map((tag) => ({ value: tag, weight: 8 })),
    ],
    secondary: [{ value: item.answer, weight: 4 }],
  };
}

export function buildContentPrimaryEntries(item) {
  return [
    { value: item.title, weight: 11 },
    { value: item.topic, weight: 9 },
    { value: item.category, weight: 8 },
    { value: item.section, weight: 6 },
    ...(item.tags || []).map((tag) => ({ value: tag, weight: 10 })),
    ...(item.search_terms || []).map((term) => ({ value: term, weight: 10 })),
  ];
}

export function buildContentWeightMap(item) {
  return {
    primary: buildContentPrimaryEntries(item),
    secondary: [
      { value: item.summary, weight: 5 },
      { value: item.excerpt, weight: 4 },
      { value: item.body, weight: 1 },
    ],
  };
}

export function buildCurriculumWeightMap(item) {
  return {
    primary: [
      { value: item.title, weight: 11 },
      { value: item.relativePath, weight: 7 },
      ...(item.search_terms || []).map((term) => ({ value: term, weight: 10 })),
      ...(item.tags || []).map((tag) => ({ value: tag, weight: 9 })),
    ],
    secondary: [{ value: item.summary, weight: 3 }],
  };
}

export const searchResultKeyBuilders = {
  links: (item) => String(item.id ?? item.slug ?? item.title),
  faqEntries: (item) => String(item.id ?? item.question),
  contentDocuments: (item) => String(item.slug ?? item.title),
  curriculumReferences: (item) => String(item.slug ?? item.title),
};

