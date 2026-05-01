export const fallbackLinks = [
  {
    id: 1,
    title: "Techtonica Curriculum Repository",
    url: "https://github.com/Techtonica/curriculum",
    category: "curriculum",
    description:
      "Browse official Techtonica curriculum folders, coding challenges, and milestone materials.",
    is_featured: true,
    tags: ["curriculum", "milestones", "assignments"],
  },
  {
    id: 2,
    title: "Day Leads Document",
    url: "https://drive.google.com",
    category: "program",
    description:
      "Quick access to cohort day-lead responsibilities, reminders, and facilitation notes.",
    is_featured: true,
    tags: ["program", "day leads"],
  },
  {
    id: 3,
    title: "React Documentation",
    url: "https://react.dev/",
    category: "technical docs",
    description:
      "Official React documentation for components, hooks, state, effects, and modern React patterns.",
    is_featured: true,
    tags: ["react", "official", "documentation"],
  },
];

export const fallbackScheduleItems = [
  {
    id: 1,
    title: "Weekly Check-In",
    description: "Cohort check-in for updates, blockers, and announcements.",
    start_time: "2026-05-05T17:00:00.000Z",
    end_time: "2026-05-05T18:00:00.000Z",
    location: "Zoom",
    meeting_url: "https://example.com/check-in",
    recording_url: null,
  },
  {
    id: 2,
    title: "Office Hours",
    description: "Support session for debugging, assignments, and project questions.",
    start_time: "2026-05-07T18:00:00.000Z",
    end_time: "2026-05-07T20:00:00.000Z",
    location: "Zoom",
    meeting_url: "https://example.com/office-hours",
    recording_url: null,
  },
];

export const fallbackFaqEntries = [
  {
    id: 1,
    question: "Why is my useEffect running twice?",
    answer:
      "In development, React Strict Mode may run effects more than once to help catch side-effect bugs. Check whether it only happens in development and review the dependency array.",
    error_topic: "useEffect",
    category: "React + Vite",
    tags: ["useEffect", "debugging"],
  },
  {
    id: 2,
    question: "How do I fix a merge conflict?",
    answer:
      "Open the conflicted file, review the conflict markers, decide which code to keep, remove the markers, then add and commit the resolved file.",
    error_topic: "merge conflict",
    category: "Git & GitHub",
    tags: ["merge conflict", "debugging"],
  },
  {
    id: 3,
    question: "Why is my fetch request failing?",
    answer:
      "Check the request URL, server status, CORS configuration, and whether errors are being handled with try/catch.",
    error_topic: "fetch error",
    category: "APIs",
    tags: ["debugging"],
  },
];

export const fallbackReminders = [
  {
    id: 1,
    text: "Review tomorrow's schedule before logging off.",
    done: false,
    due_at: "2026-04-22T17:30:00.000Z",
  },
  {
    id: 2,
    text: "Save one debugging note after each work session.",
    done: true,
    due_at: null,
  },
];
