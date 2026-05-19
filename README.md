# Cohort Compass

Cohort Compass is a PERN student hub for Techtonica participants. It helps students find schedules, important links, reminders, debugging help, and searchable resources in one place.

## Project Links

- Planning document: https://docs.google.com/document/d/1yWPORO5A6SUypcOhJe4VgpmYCTEtYpDQdpOa7JSdQIo/edit?usp=sharing
- GitHub repository: https://github.com/itspaigenli/cohort-compass
- GitHub Project board: https://github.com/users/itspaigenli/projects/1/views/1
- Deployed frontend: https://cohortcompass.onrender.com
- Deployed backend: https://cohort-compass-1.onrender.com
- Backend API base: https://cohort-compass-1.onrender.com/api

## MVP Features

- Dashboard homepage with schedule, links, FAQ, reminders, and search navigation
- Search page backed by `/api/search`, with typed search, grouped results, and empty state
- Backend `/api/search` endpoint for searching important links and FAQ entries
- FAQ page with real FAQ entries and client-side filtering
- Important links and FAQ data loaded from the backend
- Reminder list backed by the database
- Monthly calendar view on the dashboard
- Schedule items connected to the monthly calendar and schedule preview
- Frontend and backend tests for key MVP behavior

## Tech Stack

- PostgreSQL
- Express
- React
- Node.js
- Vite
- Vitest
- React Testing Library

## Project Structure

```text
cohort-compass/
├── client/              # React + Vite frontend
│   └── src/
│       ├── components/  # Dashboard feature components
│       ├── pages/       # Dashboard, search, and FAQ pages
│       ├── services/    # API helper functions
│       └── utils/       # Date/time helpers
├── server/              # Express backend
│   └── src/
│       ├── config/      # Database connection
│       ├── controllers/ # Route handlers
│       ├── db/          # Schema and seed data
│       ├── models/      # Database queries
│       └── routes/      # Express routers
└── shared/              # Shared search planning files
```

## Local Setup

Clone the repository:

```bash
git clone https://github.com/itspaigenli/cohort-compass.git
cd cohort-compass
```

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

Create environment files from the samples:

```bash
cp server/.env-sample server/.env
cp client/.env-sample client/.env
```

The client expects the API URL:

```text
VITE_API_URL=http://localhost:3000/api
```

The server expects:

```text
DATABASE_URL=postgresql://yourusername@localhost:5432/cohort-compass-db
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
GOOGLE_CALENDAR_ID=
GOOGLE_API_KEY=
GOOGLE_CALENDAR_TIMEZONE=America/Los_Angeles
GOOGLE_CALENDAR_LOOKAHEAD_DAYS=30
GOOGLE_CALENDAR_MAX_RESULTS=100
```

Google Calendar values are optional for local development. If they are not set,
the schedule uses the PostgreSQL `schedule_items` fallback data.

Create and seed the local PostgreSQL database using the SQL files in `server/src/db/`:

```bash
psql -d cohort-compass-db -f server/src/db/schema.sql
psql -d cohort-compass-db -f server/src/db/seed.sql
```

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend in a second terminal:

```bash
cd client
npm run dev
```

Local URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## API Routes

- `GET /api/links` returns important links
- `GET /api/faq` returns FAQ entries
- `GET /api/reminders` returns reminders
- `POST /api/reminders` creates a reminder
- `PATCH /api/reminders/:id` updates a reminder
- `DELETE /api/reminders/:id` deletes a reminder
- `GET /api/schedule` returns schedule items
- `GET /api/search?q=react` returns matching links and FAQ entries

## Tests

Run frontend tests:

```bash
cd client
npm run test:run
```

Run backend tests:

```bash
cd server
npm test
```

Current verified test status after MVP merge:

- Client: 10 test files, 29 tests passing
- Server: 3 test files, 9 tests passing

## Current MVP Status

The MVP is demoable with the main student-support flow in place: dashboard, search, FAQ, reminders, schedule preview, and a monthly calendar connected to schedule items.

Known remaining polish:

- Reminders are not shown on the calendar yet.
- README and demo polish should be reviewed before final submission.
- Accessibility and responsive layout should receive a final pass.
- Final deployed links should be checked after merging to `main`.
