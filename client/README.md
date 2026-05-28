# Cohort Compass Client

This folder contains the React + Vite frontend for Cohort Compass.

## Local Development

Install dependencies:

```bash
npm install
```

Create `client/.env` from the sample if you want to override the API URL:

```bash
cp .env-sample .env
```

Optional local API URL:

```text
VITE_API_URL=http://localhost:3000/api
```

Run the client:

```bash
npm run dev
```

## Production

The production frontend is built with Vite and served by the Express server.

Build command:

```bash
npm run build
```

Production uses `/api` on the same server, so `VITE_API_URL` is not required.

The `dist/` folder is generated build output and should not be committed.
