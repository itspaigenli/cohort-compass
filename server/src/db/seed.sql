INSERT INTO important_links (title, url, category, description, is_featured)
VALUES
  (
    'Techtonica Curriculum Repository',
    'https://github.com/Techtonica/curriculum',
    'curriculum',
    'Browse official Techtonica curriculum folders, coding challenges, and milestone materials.',
    TRUE
  ),
  (
    'Day Leads Document',
    'https://drive.google.com',
    'program',
    'Quick access to cohort day-lead responsibilities, reminders, and facilitation notes.',
    TRUE
  ),
  (
    'Milestone Folders',
    'https://github.com/Techtonica/curriculum/tree/main/objectives',
    'curriculum',
    'Open the milestone-aligned curriculum folders for the current cohort topics.',
    TRUE
  ),
  (
    'Compass Content Repository',
    'https://github.com/itspaigenli/compass-content',
    'content',
    'Source repository for the curated markdown documents used throughout Cohort Compass.',
    TRUE
  ),
  (
    'Techtonica Participant Handbook',
    'https://github.com/itspaigenli/compass-content/blob/main/docs/program/participant-handbook.md',
    'program',
    'Program expectations, policies, and participant guidance in one place.',
    TRUE
  ),
  (
    'MDN HTML Documentation',
    'https://developer.mozilla.org/en-US/docs/Web/HTML',
    'technical docs',
    'Official MDN reference and guides for HTML elements, semantics, forms, and web structure.',
    TRUE
  ),
  (
    'W3Schools HTML Tutorial',
    'https://www.w3schools.com/html/',
    'technical docs',
    'Beginner-friendly HTML reference, examples, and practice material for core markup concepts.',
    TRUE
  ),
  (
    'MDN CSS Documentation',
    'https://developer.mozilla.org/en-US/docs/Web/CSS',
    'technical docs',
    'Official MDN reference for CSS properties, layout, selectors, and styling patterns.',
    TRUE
  ),
  (
    'MDN JavaScript Guide',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'technical docs',
    'Official MDN JavaScript documentation covering syntax, concepts, APIs, and examples.',
    TRUE
  ),
  (
    'React Documentation',
    'https://react.dev/',
    'technical docs',
    'Official React documentation for components, hooks, state, effects, and modern React patterns.',
    TRUE
  );

INSERT INTO faq_entries (question, answer, error_topic, category)
VALUES
  (
    'Why is my useEffect running twice?',
    'In development, React Strict Mode may run effects more than once to help catch side-effect bugs. Check whether it only happens in development and review the dependency array.',
    'useEffect',
    'React + Vite'
  ),
  (
    'How do I fix a merge conflict?',
    'Open the conflicted file, review the conflict markers, decide which code to keep, remove the markers, then add and commit the resolved file.',
    'merge conflict',
    'Git & GitHub'
  ),
  (
    'Why is my HTML not showing up in the browser?',
    'Check that your tags are properly nested, the file is saved, and the browser is loading the correct HTML file. A missing closing tag or typo in the structure can break the page quickly.',
    'html structure',
    'HTML'
  ),
  (
    'Why are my CSS styles not applying?',
    'Make sure the stylesheet is linked correctly, the selector matches the element you expect, and another rule is not overriding it with higher specificity.',
    'css styles',
    'CSS'
  ),
  (
    'Why am I getting "Cannot read properties of undefined"?',
    'This usually means code is trying to access a property before the object or data exists. Check async timing, state initialization, and conditional rendering.',
    'undefined error',
    'JavaScript Fundamentals'
  ),
  (
    'Why is my fetch request failing?',
    'Check the request URL, server status, CORS configuration, and whether errors are being handled with try/catch.',
    'fetch error',
    'APIs'
  ),
  (
    'Why does my Express route return 404?',
    'Check the route path, the HTTP method, and whether the router is mounted correctly in the server entry file. A 404 usually means the request path does not match a registered route.',
    '404 route',
    'Node & Express'
  ),
  (
    'Why is my SQL query failing?',
    'Check table and column names, verify your SQL syntax, and confirm the values you pass match the expected data types. The database error message usually points to the problem.',
    'sql error',
    'SQL & Postgres'
  ),
  (
    'Why is my test failing even though the UI looks right?',
    'Tests often fail because the rendered text, timing, or selectors are different than expected. Re-check the exact output and wait for async UI updates before asserting.',
    'test failure',
    'Testing'
  ),
  (
    'Why is my deployment failing?',
    'Check environment variables, build commands, start commands, and whether the deployed server can find the right database or API base URL. Deployment errors are often configuration mismatches rather than code logic bugs.',
    'deployment error',
    'Deployment'
  );

INSERT INTO schedule_items (title, description, start_time, end_time, location, meeting_url, recording_url)
VALUES
  (
    'Weekly Check-In',
    'Cohort check-in for updates, blockers, and announcements.',
    '2026-05-05 17:00:00',
    '2026-05-05 18:00:00',
    'Zoom',
    'https://example.com/check-in',
    NULL
  ),
  (
    'Office Hours',
    'Support session for debugging, assignments, and project questions.',
    '2026-05-07 18:00:00',
    '2026-05-07 20:00:00',
    'Zoom',
    'https://example.com/office-hours',
    NULL
  ),
  (
    'Pair Programming Session',
    'Collaborative coding session focused on implementation and debugging.',
    '2026-05-14 18:00:00',
    '2026-05-14 19:00:00',
    'Zoom',
    'https://example.com/pair-programming',
    NULL
  ),
  (
    'Project Share',
    'Weekly project update and milestone share-out.',
    '2026-05-15 19:30:00',
    '2026-05-15 21:00:00',
    'Zoom',
    'https://example.com/project-share',
    NULL
  );

INSERT INTO reminders (text, done, due_at)
VALUES
  ('Review tomorrow''s schedule before logging off.', FALSE, '2026-04-22 17:30:00'),
  ('Save one debugging note after each work session.', TRUE, NULL),
  ('Draft your next question before office hours.', FALSE, '2026-04-24 16:00:00');

INSERT INTO tags (name)
VALUES
  ('curriculum'),
  ('milestones'),
  ('assignments'),
  ('program'),
  ('day leads'),
  ('content'),
  ('docs'),
  ('handbook'),
  ('html'),
  ('css'),
  ('javascript'),
  ('js'),
  ('react'),
  ('mdn'),
  ('w3schools'),
  ('official'),
  ('web'),
  ('documentation'),
  ('useEffect'),
  ('merge conflict'),
  ('debugging'),
  ('deployment');

INSERT INTO important_link_tags (link_id, tag_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 4),
  (2, 5),
  (3, 1),
  (3, 2),
  (4, 6),
  (4, 7),
  (5, 4),
  (5, 8),
  (6, 9),
  (6, 14),
  (6, 18),
  (6, 19),
  (7, 9),
  (7, 15),
  (7, 18),
  (7, 19),
  (8, 10),
  (8, 14),
  (8, 18),
  (8, 19),
  (9, 11),
  (9, 12),
  (9, 14),
  (9, 18),
  (10, 13),
  (10, 16),
  (10, 17),
  (10, 18);

INSERT INTO faq_tags (faq_entry_id, tag_id)
SELECT faq_entries.id, tags.id
FROM faq_entries
JOIN tags
  ON tags.name IN ('useEffect', 'debugging')
WHERE faq_entries.error_topic = 'useEffect';

INSERT INTO faq_tags (faq_entry_id, tag_id)
SELECT faq_entries.id, tags.id
FROM faq_entries
JOIN tags
  ON tags.name IN ('merge conflict', 'debugging')
WHERE faq_entries.error_topic = 'merge conflict';

INSERT INTO faq_tags (faq_entry_id, tag_id)
SELECT faq_entries.id, tags.id
FROM faq_entries
JOIN tags
  ON tags.name = 'deployment'
WHERE faq_entries.error_topic = 'deployment error';
