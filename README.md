# Carbon Tracker — Frontend

A React + Vite application for tracking and understanding your personal carbon footprint.

## Why This Project

Human activity is one of the leading drivers of climate change, yet most people have little visibility into the carbon cost of their daily choices — commuting, eating, heating their homes, or shopping. Carbon Tracker bridges that gap by giving individuals a simple, personal tool to log activities, see the CO₂ impact in real terms, and track how their footprint changes over time. The goal is to turn abstract climate statistics into concrete, actionable personal data.

## Features

- **Activity Logging** — Record daily activities across four categories: Transportation, Food, Home Energy, and Shopping. CO₂ emissions are calculated automatically using established emission factors.
- **Dashboard Overview** — At-a-glance stats for total emissions, weekly totals, and average per activity, alongside a category breakdown donut chart and a full activity list with delete support.
- **Analytics Page** — Explore your footprint over 7 days, 30 days, or 12 months with a daily trend line chart, per-category bar chart, percentage breakdown, and a comparison against the previous period.
- **Authentication** — Secure JWT-based registration and login so every user's data is private.
- **Responsive Design** — Works on mobile and desktop.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Routing | React Router 6 |
| Icons | Lucide React |
| Date utils | date-fns |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (connects to local backend by default)
npm run dev

# Build for production
npm run build
```

## Connecting to a Backend

The app reads `VITE_API_URL` to determine where to send API requests.

**Local backend** (default — uses Vite dev-server proxy to `http://localhost:8000`):
```bash
# .env already sets this
VITE_API_URL=/api
```

**Hosted backend** (`https://carbon-footprint-traka.fastapicloud.dev`):
```bash
# Copy the provided preset and restart the dev server
cp .env.cloud .env.local
npm run dev
```

`.env.local` is gitignored, so your local override is never committed.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ActivityList    # Activity feed with delete
│   ├── AddActivityModal# Log-new-activity form
│   ├── CategoryChart   # Donut chart + legend
│   └── StatsCards      # Summary stat tiles
├── pages/
│   ├── AuthPage        # Login / Register
│   ├── Dashboard       # Main overview
│   └── AnalyticsPage   # Trends and breakdowns
├── services/
│   └── api.js          # Auth, activities, and analytics API clients
├── utils/
│   └── helpers.js      # Formatters, metadata, colour maps
├── App.jsx             # Routes and auth guards
└── main.jsx            # Entry point
```

## Design System

- Custom colour palette: `earth` (green tones) and `carbon` (neutral grays)
- Typography: Space Grotesk (headings) + Inter (body)
- Card style: soft shadows with subtle backdrop blur
