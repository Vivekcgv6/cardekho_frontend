# MrWiseDrive — Frontend

*"We recommend cars, not regrets."*

The React app for MrWiseDrive — the questionnaire, the driving personality reveal, the car recommendations, all of it. Talks to the FastAPI backend for everything, doesn't do any of the actual scoring itself.

## Heads up if you're testing the deployed version

The backend runs on Render's free tier and goes to sleep after 15 minutes of no traffic. If you land on the site and the questionnaire seems stuck loading your results, that's why — give it about 50 seconds and try again. First request wakes the server up, second one works fine.

## Running it locally

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Opens at `http://localhost:5173`. Make sure the backend's running too (see the backend README) — by default this points at `http://localhost:8000`, change `VITE_API_URL` in `.env` if yours is somewhere else.

## What's actually here

- **Landing** → **Questionnaire** → **Personality reveal** → **Recommendations** → **Compare** → **Summary** → **Goodbye**, all wired up with React Router
- One context (`JourneyContext`) holding the questionnaire answers and results, synced to localStorage so nobody loses their progress on a refresh
- A canvas-rendered, downloadable "driving personality" badge — no image library, just the Canvas API
- Everything's typed against the backend's Pydantic schemas, so if the API shape changes, TypeScript tells you before the browser does

## Stack

React, TypeScript, Vite, Tailwind, React Router, Framer Motion, Axios. Nothing exotic — the interesting decisions in this project are on the backend (deterministic ranking vs. AI), this side is mostly about making that feel good to actually use.

## If I had more time

A dedicated car detail page, real loading skeletons instead of a spinner, and a proper empty/error state if the backend is unreachable instead of just hanging.
