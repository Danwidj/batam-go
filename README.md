# 🌱 Batam Go — Sustainable Tourism Explorer

A Progressive Web App (PWA) that nudges tourists toward sustainable, crowd-aware itineraries across Batam. Built on a unified JavaScript stack (Node.js/Express + React/Vite) for fast iteration and easy mobile demoing via ngrok.

---

## 📌 Problem Statement

New international ports and a tourism Special Economic Zone (SEZ) are driving visitor growth, but over-tourism risks damaging mangroves, worsening traffic, and straining cultural sites. Visitors — many arriving from Singapore — lack integrated, sustainable itineraries or real-time eco-impact tools to help them spread out their visits and travel more responsibly.

---

## 💡 Solution

The app turns sustainable choices into a rewarding game loop:

- **Walk to earn points** — completed walking routes convert to redeemable step credits.
- **Local-only redemption** — vouchers are redeemable only at local businesses, shifting spend into the peripheral economy.
- **Crowd-aware routing** — routes and POIs are color-coded by crowd density (green / orange / red) to steer visitors away from congested spots in real time.
- **Eco impact tracking** — CO₂ saved, car trips avoided, and tree equivalents are shown per session to reinforce the sustainable framing.

---

## 🖥️ App Tabs

The nav bar has 4 tabs: **Home, Map, Shop, Stats**.

| Tab | Status | Description |
|-----|--------|-------------|
| 🏠 **Home** | Static mock | Landing dashboard: greeting, "Explore Batam" hero, steps progress card, popular destinations |
| 🗺️ **Map** | Functional | Leaflet map with crowd-density POI markers, selectable color-coded routes, simulated walk + geofenced check-in |
| 🛍️ **Shop** | Functional | Points redemption, voucher management (Food / Activities / Stay), QR code display, food-spot map |
| 📊 **Stats** | Static mock | Activity ring, interactive weekly bar chart, eco impact, milestone rewards stepper, badges grid |

---

## 🧭 Demo User Journey

**1 — Planning at the hotel**
Open the map. The Mangrove Boardwalk shows red (busy), the History Museum shows green (quiet). Pick the Museum first.

**2 — Afternoon check**
After the Museum, reopen the app. The Mangrove marker has flipped to green — tour buses have cleared. Tap the POI for its description, crowd status, and the attached café voucher on arrival.

**3 — Route selection**
Three walking options appear: Scenic Park Route 🌳 (low crowd, +220 pts), Direct Route 🏃 (moderate, +140 pts), Mosque Loop 🕌 (high crowd, +80 pts). Pick the Scenic route for the most credits.

**4 — Simulated walk + check-in**
Tap **"Start walking"** — a marker animates along the route over ~20 seconds (no real GPS required). Once arrived, tap **"Check In"** to confirm you're within 300 m of the Mangrove. A "You've arrived!" screen shows points earned and issues a digital café voucher.

**5 — Voucher redemption**
Open Shop → My Vouchers to see the check-in reward and any redeemed points vouchers. Tap **"Use"** on a Food voucher to browse nearby participating eateries on a map. Select one to generate a QR code — show it to the cashier.

---

## 🎭 Demo Scope (Hackathon MVP)

All sensing and multi-user features are faked/mocked for the demo.

| Feature | Demo approach |
|---------|---------------|
| Crowd density | Hardcoded time-of-day lookup per POI — not live sensor data |
| Geofence check-in | Simulated walk animates a marker along the route; distance is computed from that simulated position, not real device GPS |
| CO₂ savings | Hardcoded estimate per route — not a live routing API |
| "Pikmin" group bonus | Mentioned in the pitch as future work; not implemented |
| Festivals | Roadmap item; not implemented |
| Voucher QR redemption | Real QR generation, mock voucher data |
| Points balance / tiers | Hardcoded starting balance (`2850 pts`) and tier catalog in `data/vouchers.js` — no backend ledger |
| Step / GPS tracking | Static mock values in `data/home-mock.js` — no `navigator.geolocation` or pedometer |

---

## 🌟 Technical Highlights

- **Single-port architecture** — Express serves both `/api/*` and compiled React assets on **port 5050**. (Port 5000 is avoided — macOS AirPlay binds it by default.)
- **Mobile-first PWA** — Web App Manifest (`name: "Batam Go"`) + Service Worker auto-updates via `vite-plugin-pwa`.
- **Open-source maps** — [React-Leaflet](https://react-leaflet.js.org/) + OpenStreetMap tiles. No API key, no billing account.
- **Client-side QR codes** — [`qrcode.react`](https://www.npmjs.com/package/qrcode.react) renders voucher QR codes with zero network calls.
- **Simulated walk engine** — `requestAnimationFrame` loop interpolating a marker along a polyline using haversine geometry (`utils/geo.js`), so the check-in demo works without being physically in Batam.
- **No UI component library** — plain React + hand-written CSS (`index.css`). Keeps the dependency surface small and avoids initialization-order bugs seen with heavier component frameworks.
- **Single-Port Architecture**: Express serves both API routes (`/api/...`) and compiled React static files on **Port 5050**, eliminating CORS issues. (Not port 5000 — macOS's built-in AirPlay Receiver binds 5000 by default and silently blocks the server; 5050 avoids that.)
- **Mobile-First PWA Support**: Out-of-the-box Web App Manifest (`manifest.json`) and Service Worker auto-updates via `vite-plugin-pwa`.
- **Instant Mobile Testing**: Easily test on physical iPhones or Android devices with a single `ngrok http 5050` tunnel.
- **Unified Build Scripts**: Single command (`npm run build`) to install, bundle frontend assets, and launch the server.
- **Map & routing, fully open-source**: [Leaflet](https://react-leaflet.js.org/) + [OpenStreetMap](https://www.openstreetmap.org/) tiles — no API key, no billing account, no Google Cloud setup. (We looked at Google Maps Platform first; ruled it out since it needs a billing account even for free-tier usage and offers no branding benefit here.)
- **Client-side QR codes**: [`qrcode.react`](https://www.npmjs.com/package/qrcode.react) renders voucher QR codes with zero network calls.
- **Simulated-walk check-in**: a "Start walking" control animates a marker along the selected route's path (no real device GPS) so the demo works without being physically in Batam; Check-In distance is computed against that simulated position.
- **No UI component library**: plain React + hand-written CSS (`index.css`). Framework7-React was tried and reverted — see "UI Library Decision" below before reaching for it again.
- **Dark mode**: a nav-bar toggle switches the whole app shell between light/dark, persists the choice in `localStorage`, and defaults to the OS `prefers-color-scheme` on first load. See `frontend/src/utils/theme.js` and the theming note in `AGENTS.md`.

### API Routes

The Express backend exposes one route today:

| Method | Path | Response |
|--------|------|----------|
| `GET` | `/api/health` | `{ status: "ok", message: "Unified JS Backend Running!" }` |

All other data (POIs, routes, vouchers, stats) is bundled client-side as static JS modules under `frontend/src/data/`.

---

## 📂 Repository Structure

```
batam-go/
├── package.json          # Root orchestrator — Express deps + build scripts
├── server.js             # Express: /api/health + static PWA server (port 5050)
├── vercel.json           # Vercel deploy config (frontend/dist)
│
└── frontend/
    ├── package.json      # React 18, Vite 5, react-leaflet, qrcode.react
    ├── vite.config.js    # Vite + VitePWA (dev proxy → port 5050, dev server on port 3000)
    ├── index.html
    ├── public/           # PWA icons, manifest assets
    └── src/
        ├── main.jsx      # React root (imports Leaflet CSS)
        ├── App.jsx       # Tab router + shared voucher state
        ├── index.css     # All styles — app shell + per-screen (plain CSS)
        ├── components/
        │   ├── Home.jsx          # Static landing screen
        │   ├── MapView.jsx       # Leaflet map, POI markers, route picker, walk sim, check-in
        │   ├── Shop.jsx          # Points redemption, my vouchers, food-spot map, QR display
        │   ├── Stats.jsx         # Activity ring, weekly bar chart, eco impact, badges
        │   ├── NavBar.jsx        # Bottom tab bar
        │   └── ConsentBanner.jsx # First-visit geolocation disclosure (persisted in localStorage)
        ├── data/
        │   ├── home-mock.js  # Shared mock data for Home + Stats (user, steps, badges, rewards)
        │   ├── pois.js       # POI coords + crowd lookup logic
        │   ├── routes.js     # Walking route polylines + CO₂/distance/points metadata
        │   └── vouchers.js   # Points economy, reward tiers, food spots, initial voucher holdings
        └── utils/
            ├── geo.js        # Haversine distance (used for geofence check-in)
            └── rewards.js    # Pure points/redemption math (used by Shop)
```

---

## ⏱️ Quick Start

### 1. Install dependencies

```bash
npm install
```

> `postinstall` automatically runs `cd frontend && npm install`.

### 2. Build + run (production / mobile testing)

```bash
npm run build
```

Builds the frontend and starts the Express server on **`http://localhost:5050`**.

### 3. Frontend dev mode (hot reload)

```bash
npm run dev
```

Vite serves the frontend on **`http://localhost:3000`** with HMR. The `/api/*` proxy forwards to port 5050 — keep the Express server running in a second terminal (`npm start`) for API calls to resolve.

### 4. Test on a real phone (ngrok)

```bash
# Terminal 1
npm run build

# Terminal 2
ngrok http 5050
```

Open the `https://...` ngrok URL on your phone → **"Add to Home Screen"** to install as a PWA.

> **Local vs. sharing:** `npm run dev` is local-only (fast iteration, not shareable). For sharing with teammates or testing on phones, always use `npm run build` + ngrok — LAN IP sharing is unreliable on venue WiFi due to client isolation and iOS restrictions.

---

## 🛠️ Tooling

### Git sync helper

Automates fetch, rebase, conventional-commit formatting, and push:

```bash
./.agents/skills/git/scripts/git-sync
```
