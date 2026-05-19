# Cohort Compass

Cohort Compass is a PERN student hub for Techtonica participants. It helps students find schedules, important links, reminders, debugging help, and searchable resources in one place.

## Project Links

- Planning document: https://docs.google.com/document/d/1yWPORO5A6SUypcOhJe4VgpmYCTEtYpDQdpOa7JSdQIo/edit?usp=sharing
- GitHub repository: https://github.com/itspaigenli/cohort-compass
- GitHub Project board: https://github.com/users/itspaigenli/projects/1/views/1
- Deployment target: Render web service

## MVP Features

- Dashboard homepage with schedule, links, FAQ, reminders, and search navigation
- Search page backed by `/api/search`, with grouped links, FAQ, curriculum references, content docs, and suggested videos
- Backend `/api/search` endpoint for searching important links, FAQ entries, Techtonica curriculum references, and compass-content docs
- FAQ page with real FAQ entries and client-side filtering
- Important links and FAQ data loaded from the backend
- Reminder list backed by the database
- Monthly calendar view on the dashboard
- Schedule items connected to the monthly calendar and schedule preview, with optional Google Calendar source and database schedule data
- Techtonica curriculum references loaded from the GitHub repo tree
- compass-content markdown documents loaded from local content files when available
- Date and time helpers handled with `date-fns` and `date-fns-tz`
- Frontend and backend tests for key MVP behavior

## Tech Stack

- PostgreSQL
- Express
- React
- Node.js
- Vite
- date-fns and date-fns-tz
- Vitest
- React Testing Library
- Supertest
- Font Awesome

## Project Structure

```text
cohort-compass/
├── client/              # React + Vite frontend
│   └── src/
│       ├── components/  # Dashboard feature components
│       ├── pages/       # Dashboard, search, and FAQ pages
│       ├── services/    # API helper functions
│       ├── data/        # Suggested video resources
│       └── utils/       # Date/time and search helpers
├── server/              # Express backend
│   └── src/
│       ├── config/      # Database connection
│       ├── controllers/ # Route handlers
│       ├── db/          # Schema and seed data
│       ├── lib/         # External data helpers
│       ├── models/      # Data access functions
│       └── routes/      # Express routers
└── shared/              # Shared search helper files
```

## Images

The app currently uses one checked-in image asset as the hero background on the dashboard, search, and FAQ pages.

![Cohort Compass hero background](client/src/assets/techtonica-hero-perplexity-cat.png)

- Image file: `client/src/assets/techtonica-hero-perplexity-cat.png`
- Image size: 1536 x 1024
- Used in: `DashboardPage.jsx`, `SearchPage.jsx`, and `FAQPage.jsx`

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

The client uses `/api` by default. During local frontend development, Vite
proxies `/api` requests to the backend on port `3000`.

The optional client API URL is:

```text
VITE_API_URL=http://localhost:3000/api
```

The server expects:

```text
DATABASE_URL=postgresql://yourusername@localhost:5432/cohort-compass-db
DATABASE_SSL=false
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
GOOGLE_CALENDAR_ID=
GOOGLE_API_KEY=
GOOGLE_CALENDAR_TIMEZONE=America/Los_Angeles
GOOGLE_CALENDAR_LOOKAHEAD_DAYS=30
GOOGLE_CALENDAR_MAX_RESULTS=100
```

Google Calendar values are optional for local development. If they are not set,
the schedule uses the PostgreSQL `schedule_items` data.

The compass-content values are also optional and can be added to `server/.env`
when you have the local content repository:

```text
COMPASS_CONTENT_PATH=/Users/yourusername/Desktop/GitHub/compass-content
COMPASS_CONTENT_REPO_BASE=https://github.com/itspaigenli/compass-content/blob/main
```

If the local content repository is not available, the content endpoint returns
an empty list instead of breaking the app. No fake content documents are used.

Data comes from the database, Google Calendar when configured, Techtonica
curriculum references, compass-content files, and the small curated video list
in `client/src/data/videoResources.js`. No fake app data is used.

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

## Production Setup

Cohort Compass follows the Techtonica production-readiness setup where Express
serves the built React app.

Build the frontend:

```bash
cd client
npm run build
```

Start the production server:

```bash
cd ../server
npm start
```

The production server serves:

- React app from `client/dist`
- API routes from `/api`
- Health check from `/api/health`

Render production setup:

- Service: Render web service
- Root directory: repository root
- Build command:

```text
npm install --prefix server && npm install --prefix client && npm run build --prefix client
```

- Start command:

```text
npm start --prefix server
```

- Production environment variables:

```text
DATABASE_URL=your-production-postgres-url
DATABASE_SSL=true
PORT=provided-by-render
GOOGLE_CALENDAR_ID=
GOOGLE_API_KEY=
GOOGLE_CALENDAR_TIMEZONE=America/Los_Angeles
GOOGLE_CALENDAR_LOOKAHEAD_DAYS=30
GOOGLE_CALENDAR_MAX_RESULTS=100
```

Production does not need `VITE_API_URL` because the built frontend and API use
the same deployed server.

## API Routes

- `GET /api/links` returns important links
- `GET /api/faq` returns FAQ entries
- `GET /api/reminders` returns reminders
- `POST /api/reminders` creates a reminder
- `PATCH /api/reminders/:id` updates a reminder
- `DELETE /api/reminders/:id` deletes a reminder
- `GET /api/schedule` returns schedule items
- `GET /api/curriculum` returns Techtonica curriculum references
- `GET /api/content` returns compass-content documents
- `GET /api/content/doc?slug=program/participant-handbook` returns one content document
- `GET /api/search?q=react` returns matching links, FAQ entries, curriculum references, and content docs

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

Current verified test status:

- Client: 17 test files, 44 tests passing
- Server: 12 test files, 32 tests passing

## Current MVP Status

The MVP is demoable with the main student-support flow in place: dashboard, search, FAQ, reminders, schedule preview, a monthly calendar, Google Calendar-backed schedule support, curriculum references, compass-content document search, and suggested video resources.

Optional future polish:

- Reminders are not shown on the calendar yet.
- Accessibility and responsive layout should receive a final pass.
- Final deployed links should be checked after merging to `main`.
