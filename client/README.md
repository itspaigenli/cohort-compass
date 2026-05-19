# Cohort Compass Client

This folder contains the React + Vite frontend for Cohort Compass.

## Local Development

Install dependencies:

```bash
npm install
```

Create `client/.env` from the sample:

```bash
cp .env-sample .env
```

Local API URL:

```text
VITE_API_URL=http://localhost:3000/api
```

Run the client:

```bash
npm run dev
```

## Production

The production frontend is built with Vite and deployed as a Render static site.

Build command:

```bash
npm run build
```

Production API URL:

```text
VITE_API_URL=https://cohort-compass-1.onrender.com/api
```

The `dist/` folder is generated build output and should not be committed.
