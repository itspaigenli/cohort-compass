export const mockLinks = [
  {
    id: 1,
    title: "Techtonica Curriculum Repository",
    url: "https://github.com/Techtonica/curriculum",
    category: "curriculum",
    description: "Official Techtonica curriculum, lessons, and project materials.",
    is_featured: true,
    tags: ["curriculum", "lessons", "projects"],
  },
  {
    id: 2,
    title: "Compass Content Repository",
    url: "https://github.com/itspaigenli/compass-content",
    category: "content",
    description: "Cohort Compass markdown docs and participant resources.",
    is_featured: true,
    tags: ["docs", "resources", "content"],
  },
  {
    id: 3,
    title: "React Documentation",
    url: "https://react.dev/",
    category: "technical docs",
    description: "Official React docs for components, state, effects, and hooks.",
    is_featured: true,
    tags: ["react", "hooks", "components"],
  },
];

export const mockFaqEntries = [
  {
    id: 1,
    question: "Why is my fetch request failing?",
    answer:
      "Check that the backend is running, the frontend is using the right API URL, and the server allows your localhost origin.",
    error_topic: "fetch error",
    category: "APIs",
    tags: ["fetch", "api", "cors"],
  },
  {
    id: 2,
    question: "Why is my component not updating?",
    answer:
      "Make sure you are using React state setters instead of changing arrays or objects directly.",
    error_topic: "state update",
    category: "React",
    tags: ["react", "state"],
  },
  {
    id: 3,
    question: "How do I debug a failing route?",
    answer:
      "Check the route path, HTTP method, controller, model, and database query in that order.",
    error_topic: "route error",
    category: "Express",
    tags: ["express", "routes", "debugging"],
  },
];

export const mockScheduleItems = [
  {
    id: "mock-standup",
    title: "Stand Up & Quiz Review",
    description: "Daily goals, blockers, and quiz review with the cohort.",
    start_time: "2026-05-19T17:00:00-07:00",
    end_time: "2026-05-19T17:50:00-07:00",
    location: "Zoom",
    meeting_url: "https://calendar.google.com",
    recording_url: "",
    source: "mock-data",
  },
  {
    id: "mock-workshop",
    title: "Pair Programming",
    description: "Collaborative coding and debugging practice.",
    start_time: "2026-05-19T18:00:00-07:00",
    end_time: "2026-05-19T18:50:00-07:00",
    location: "Zoom",
    meeting_url: "https://calendar.google.com",
    recording_url: "",
    source: "mock-data",
  },
];

export const mockContentDocuments = [
  {
    slug: "participant-handbook",
    title: "Participant Handbook",
    summary: "Program expectations, policies, and participant guidance.",
    excerpt: "Program expectations, policies, and participant guidance.",
    relativePath: "docs/program/participant-handbook.md",
    repoUrl:
      "https://github.com/itspaigenli/compass-content/blob/main/docs/program/participant-handbook.md",
  },
];

export const mockCurriculumReferences = [
  {
    slug: "techtonica-curriculum",
    title: "Techtonica Curriculum",
    summary: "Official Techtonica curriculum repository.",
    relativePath: "README.md",
    url: "https://github.com/Techtonica/curriculum",
  },
];
