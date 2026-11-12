# PrintPilot — Campus Printing Assistant

A simple, intuitive platform that lets students configure and prepare print jobs before visiting the campus print shop or library terminals, preview estimated costs, and track printing queues.

## Features
- **Print Job Preparation**: Mock document upload or document title input with pre-configured samples (Lab manuals, essays, thesis drafts).
- **Flexible Print Parameters**:
  - Page selection (all pages vs custom range like `1-5, 8`)
  - Page count configuration
  - Copy count controls
  - Paper sizes (A4, Letter, A3 poster)
  - Color mode (Black & White vs Full Color)
  - Two-sided duplex printing with 15% discount
  - Campus pick-up station selection (Library, Student Union, Engineering Quad, Dorm Kiosk)
- **Real-Time Cost Estimator**: Calculates exact printing charges dynamically based on official campus rates.
- **Interactive Print Queue**: Live job status tracking (`Queued`, `Printing`, `Ready for Pickup`, `Completed`) with simulation controls to advance or cancel jobs.
- **Local Persistence & Demo Reset**: Saves submitted jobs in `localStorage` with a 1-click reset option.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Styling**: Modern, responsive custom CSS design system

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm

### Installation & Local Run
From this directory (`PrintPilot`):
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

To build for production:
```bash
npm run build
```
The production bundle will be generated in `dist/`.

To preview the production build locally:
```bash
npm run preview
```

## Deployment
This application is completely static and ready for instant deployment to any static hosting provider:
- **Vercel**: Set root directory to `PrintPilot`, build command to `npm run build`, and output directory to `dist`.
- **Netlify**: Connect via Git or publish the `dist` directory with `npm run build`.
- **GitHub Pages**: Deploy the `dist` folder via `gh-pages` or GitHub Actions.
