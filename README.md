# Carbon Tracker Frontend

A React + Vite application for tracking carbon footprint activities.

## Features

- Track daily carbon-emitting activities
- Visualize emissions by category with charts
- View statistics and trends
- Authentication system

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Lucide React** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (Auth, Dashboard)
├── services/       # API service layer
├── utils/          # Helper functions
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Design System

- Custom color palette: `earth` (green) and `carbon` (gray) tones
- Typography: Space Grotesk (display) + Inter (body)
- Glassmorphism cards with backdrop blur
