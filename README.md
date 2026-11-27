# Cal's Concert Calendar

> A simple, shareable web app to view upcoming concert events from Google Calendar.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)](https://www.calgod.com/)

### Live Demo

[Visit Cal's Concert Calendar](https://www.calgod.com/)

## Table of Contents

- [About](#about)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Workers](#workers)
- [Contact](#contact)

---

## About

Cal's Concert Calendar pulls concert events from a Google Calendar and presents them in a clear, digestible, and shareable format. This app is designed to make it easy to stay updated and share concert event details with friends.

## Technologies Used

- **Frontend**: React, Mantine UI, Vite (Cloudflare Pages: `concertcalendar`)
- **Backend**: Cloudflare Workers (`concert-calender-api`, `lastfm-api`)
- **Hosting**: Cloudflare

## Features

- **Calendar Integration**: Fetches events directly from a Google Calendar.
- **Responsive Design**: Viewable on any device.
- **Event Cards**: Each concert event is displayed on a card, showing the event title, date, and location, with address details expandable.

## Architecture

| Piece | Cloudflare resource | Source in this repo |
| --- | --- | --- |
| React SPA | Pages project `concertcalendar` (`*.pages.dev`) | `src/`, Vite build |
| Calendar + Sheets API | Worker `concert-calender-api` → `*calgod.com/api*` | `workers/concert-calender-api/` |
| Last.fm API | Worker `lastfm-api` → `*calgod.com/lastfm-api*` | `workers/lastfm-api/` |

Worker names match the existing dashboard Workers (including the historical `calender` spelling) so Wrangler and Workers Builds deploy to the same production scripts.

## Getting Started

### Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run preview`

Starts a local web server for previewing the built solution from the `build` folder.
Open [http://localhost:4173](http://localhost:4173) to view the production build.

## Workers

The API Workers are managed with [Wrangler](https://developers.cloudflare.com/workers/wrangler/).

### Local development

```bash
cp workers/concert-calender-api/.dev.vars.example workers/concert-calender-api/.dev.vars
cp workers/lastfm-api/.dev.vars.example workers/lastfm-api/.dev.vars
# fill in GOOGLE_CALENDAR_API_KEY and LASTFM_API_KEY

npm run dev:concert-api
npm run dev:lastfm-api
```

### Deploy from this machine

Secrets already exist on the production Workers. Non-secret `vars` live in each `wrangler.jsonc`.

```bash
npx wrangler login   # once
npm run deploy:workers
```

Or deploy one Worker:

```bash
npm run deploy:concert-api
npm run deploy:lastfm-api
```

### Connect Workers Builds (recommended CI)

For each Worker in the Cloudflare dashboard:

1. Workers & Pages → open the Worker → **Settings** → **Builds** → **Connect**
2. Select this GitHub repo (`calgod/ConcertCalendar`)
3. Set:
   - **Root directory**: repo root (leave empty / `.`)
   - **Build command**: _(empty)_
   - **Deploy command**:
     - `concert-calender-api`: `npm run deploy:concert-api`
     - `lastfm-api`: `npm run deploy:lastfm-api`
4. Ensure the Worker name in the dashboard matches `name` in that Worker's `wrangler.jsonc`

Production secrets stay in **Settings → Variables and Secrets**; do not put API keys in git.

## Contact

Developed by [Cal Goddard](mailto:me@calgod.com).
