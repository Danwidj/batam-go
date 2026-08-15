# 🌱 Sustainable Tourism Explorer: Eco-Friendly Visitor Experiences

A Progressive Web App (PWA) that nudges tourists toward sustainable, crowd-aware itineraries — built on a **Unified JavaScript Stack** (Node.js/Express backend + React/Vite PWA frontend) for fast iteration and easy mobile demoing via ngrok.

---

## 📌 Problem Statement

New international ports and a tourism Special Economic Zone (SEZ) are driving visitor growth, but over-tourism risks damaging mangroves, worsening traffic, and straining cultural sites. Visitors — many arriving from Singapore — lack integrated, sustainable itineraries or real-time eco-impact tools to help them spread out their visits and travel more responsibly.

---

## 💡 Solution

The app turns sustainable choices into a rewarding game loop:

- **Walk to earn vouchers** — physical movement (steps, completed routes) is converted into redeemable rewards.
- **Local-only redemption** — vouchers can only be spent on local businesses, directly promoting local tourism and shifting spend into the local economy.
- **"Pikmin" following bonus** — if other visitors follow the same low-impact route/path, everyone collects bonus points, encouraging convergence onto sustainable routes rather than scattered ad-hoc traffic.
- **Festivals** — limited-time events at specific locations to drive interest toward underused sites.
- **Red roads** — routes are color-coded on the map, with red indicating heavy traffic/congestion to steer visitors away in real time.

### Interfaces

Nav bar is 4 tabs: **Home, Map, Shop, Stats** (matches the teammate-designed wireframe — see `frontend/src/components/Home.jsx` for the Canva reference implementation).

- **Home** *(core, static mock)* — landing dashboard: greeting header, "Explore Batam" hero card, search bar (non-functional), steps progress card, "Popular in Batam" destination cards. All data is hardcoded in `data/home-mock.js`; no buttons are wired up yet — visual scaffold only, matching the wireframe.
- **Map** *(core, functional)* — points of interest with crowd-density markers, selectable color-coded routes, and a simulated-walk Check-In flow.
- **Shop** *(core, functional)* — was "Wallet" in earlier drafts, renamed to match the design. Currently shows the voucher list + QR codes; a real storefront (purchasable items) is future work.
- **Stats** *(core, static mock)* — "Your Activity" (steps ring, weekly bar chart, eco impact, next-reward progress) and "Rewards & Badges" (milestone stepper, badges grid) sub-views, toggled via an in-screen segmented control. All data is hardcoded in `data/home-mock.js`; matches the Canva wireframe.
- **Color-coded pitstops/landmarks** — visual crowd-density signal used to actively manage and disperse crowds (implemented on the Map tab).

### Demo Scope (Hackathon MVP)

Everything is faked/mocked for the demo — no real backend sensing or multiplayer infrastructure. This keeps the build achievable in the time available while telling the same story:

| Feature | Demo approach |
|---|---|
| Crowd density / red roads | Hardcoded time-of-day lookup table, not live sensor data |
| Geofence check-in | **Simulated walk** — a "Start walking" control animates a marker along the selected route's path over ~15–25s; Check-In distance is computed from that simulated position, not real device GPS (`navigator.geolocation` was removed, not kept as a fallback) |
| "Pikmin" following bonus | Static copy (e.g. "12 other travelers took this route today +50 pts") — no real multi-user path tracking |
| CO₂ savings ticker | Hardcoded estimate per route/mode, not a live routing API |
| Voucher QR redemption | Real QR generation/scan, but pointing at mock voucher data |
| Points balance / voucher tiers | Hardcoded starting balance and tier catalog in `data/vouchers.js`, not a real ledger or backend |
| Home screen | Static visual mock only — no real step tracking, search, or "View Map" navigation wired up yet |
| Stats screen | Static visual mock only — hardcoded steps/eco-impact/rewards data in `data/home-mock.js`, no real step tracking |
| Festivals | Out of scope for the demo — mentioned in the pitch as roadmap/future work |

---

## 🧭 User Journey

**Step 1 — Pre-Departure Decision at Accommodation**
The user opens the PWA from their hotel room to plan their morning outing. The map shows a central **History Museum** and a peripheral **Mangrove Boardwalk**, each with a live crowd indicator: the Mangrove is red (**"Very crowded"**), the Museum is green (**"Not crowded"**). Lower crowds mean better rewards (steps-based). The user bypasses the congested mangrove and heads to the Museum first.

**Step 2 — Traveling and Exploring the Museum**
After visiting the Museum, the user reopens the app to check the afternoon schedule. The Mangrove marker has flipped from red to green now that morning tour buses have left. Tapping the Mangrove pop-up shows the site description, current quiet status, and an attached reward voucher for a nearby local eatery upon arrival.

**Step 3 — Route Selection and Green Transit**
Navigating from the Museum to the Mangrove, the user sees three named routing options — Scenic Park Route, Direct Route, and Mosque Loop — each showing time, distance, step-credit points, and a crowd-level badge, color-coded by crowd (red = more crowded). A CO₂-saved estimate is shown per route. The user picks the low-crowd Scenic Park Route for the most step credits.

**Step 4 — Arrival at the Mangrove (Simulated Walk)**
The user taps **"Start walking"**, which animates their position along the selected route toward the Mangrove entrance over ~15–25 seconds — a stand-in for physically walking there, so the demo works without anyone needing to be on-site in Batam. Once the simulated walk arrives, tapping **"Check In"** confirms the (simulated) position is within the Mangrove's geofenced boundary. A "You've arrived!" screen then shows the points earned from the selected route with a Claim button, and issues a digital voucher for a local café down the road.

**Step 5 — Reward Redemption at the Local Eatery**
The user opens the "Shop" tab, which shows the active discount voucher linked to the completed mangrove trip under "Check-in rewards" on the My Vouchers screen. They also have points to spend from walking — the Rewards Shop lets them redeem points for additional Food/Activities/Stay vouchers, tracked alongside the check-in reward. Tapping "Use" on a Food voucher surfaces nearby participating eateries; picking one — or presenting the check-in voucher directly — shows the dynamic QR code. They present it to the cashier, who scans it to apply the discount — shifting tourist spend directly into the peripheral local economy.

---

## 🌟 Key Technical Features

- **Single-Port Architecture**: Express serves both API routes (`/api/...`) and compiled React static files on **Port 5050**, eliminating CORS issues. (Not port 5000 — macOS's built-in AirPlay Receiver binds 5000 by default and silently blocks the server; 5050 avoids that.)
- **Mobile-First PWA Support**: Out-of-the-box Web App Manifest (`manifest.json`) and Service Worker auto-updates via `vite-plugin-pwa`.
- **Instant Mobile Testing**: Easily test on physical iPhones or Android devices with a single `ngrok http 5050` tunnel.
- **Unified Build Scripts**: Single command (`npm run build`) to install, bundle frontend assets, and launch the server.
- **Map & routing, fully open-source**: [Leaflet](https://react-leaflet.js.org/) + [OpenStreetMap](https://www.openstreetmap.org/) tiles — no API key, no billing account, no Google Cloud setup. (We looked at Google Maps Platform first; ruled it out since it needs a billing account even for free-tier usage and offers no branding benefit here.)
- **Client-side QR codes**: [`qrcode.react`](https://www.npmjs.com/package/qrcode.react) renders voucher QR codes with zero network calls.
- **Simulated-walk check-in**: a "Start walking" control animates a marker along the selected route's path (no real device GPS) so the demo works without being physically in Batam; Check-In distance is computed against that simulated position.
- **No UI component library**: plain React + hand-written CSS (`index.css`). Framework7-React was tried and reverted — see "UI Library Decision" below before reaching for it again.

### 🔌 API Reference

The Express backend currently exposes one route:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Liveness check — returns `{ status: "ok", message: "Unified JS Backend Running!" }`. Useful for confirming the unified server is up before pointing ngrok/mobile devices at it. |

Everything else the frontend needs (POIs, routes, vouchers, home/stats data) is bundled client-side as static JS modules under `frontend/src/data/` — there is no database and no other backend route yet. Adding a real data-backed API is future work.

### ⚠️ UI Library Decision

Framework7-React was tried for the nav bar / list / card components and **caused a hard app-breaking bug**: `TypeError: Cannot read properties of undefined (reading 'once')`, thrown on every component due to a Framework7-React initialization-order issue (child component effects fire before the `<App>` wrapper finishes creating its internal core instance — a known issue reported on the Framework7 forum, not fixed by downgrading versions). We reverted to plain hand-rolled components, which work reliably. **Don't re-add `framework7`/`framework7-react`.** If a component library is wanted later, Konsta UI (Tailwind-based, purely presentational, no imperative core instance) is a safer bet than Framework7 — untested here, but architecturally shouldn't hit the same bug class.

---

## 📂 Repository Structure

```text
batam-go/
├── package.json             # Root orchestrator (Express dependencies & build scripts)
├── server.js                # Express backend (API routes + static PWA server)
├── .gitignore                # Excludes node_modules, dist, .env, and .DS_Store
│
├── frontend/                # React Vite PWA Application
│   ├── package.json         # React & Vite dependencies (leaflet, react-leaflet, qrcode.react)
│   ├── vite.config.js       # Vite & PWA configuration (dev proxy to port 5050)
│   ├── index.html           # Main HTML mounting point
│   ├── public/              # Static PWA assets (manifest.json, icons)
│   └── src/
│       ├── main.jsx         # React mounting (imports Leaflet CSS)
│       ├── App.jsx          # Tab switching (Home / Map / Shop / Stats) + shared voucher state
│       ├── index.css        # App shell + per-screen styling (plain CSS, no UI kit — see note below)
│       ├── components/
│       │   ├── Home.jsx     # Static mock landing screen (matches Canva wireframe, not wired up)
│       │   ├── MapView.jsx  # Leaflet map, POI markers, route picker, simulated walk + Check-In button
│       │   ├── Shop.jsx     # Voucher list with QR codes (renamed from Wallet.jsx)
│       │   ├── Stats.jsx    # Activity + Rewards & Badges sub-views (matches Canva wireframe, in-screen toggle)
│       │   └── NavBar.jsx   # Bottom tab bar (Home / Map / Shop / Stats)
│       ├── data/
│       │   ├── pois.js       # Museum/Mangrove coordinates + hardcoded crowd lookup
│       │   ├── routes.js     # Hardcoded route polylines + CO₂/distance estimates
│       │   ├── vouchers.js   # Initial mock voucher(s)
│       │   └── home-mock.js  # Hardcoded user/steps/popular-destinations/map-pins data for Home, plus weekly-steps/rewards/badges data for Stats
│       └── utils/
│           ├── geo.js       # Haversine distance for the geofence check-in
│           └── rewards.js   # Pure points/redemption math used by Shop.jsx
│
└── .agents/skills/          # Custom Agent Skills (Git formatting, Plan writing, etc.)
    └── git/scripts/git-sync # Automated Git sync tool
```

---

## ⏱️ Quick Start Guide

### 1. Initial Setup
Install the root dependencies; a `postinstall` script automatically installs the frontend dependencies too:

```bash
npm install
```

---

### 2. Running the Unified Server (Production / Testing Mode)
Build the frontend and start the single-port Express server on **`http://localhost:5050`**:

```bash
npm run build
```

---

### 3. Frontend Development Mode (Hot Reloading)
For rapid UI iteration with hot module replacement (HMR):

```bash
npm run dev
```
> *Vite serves the frontend on **`http://localhost:3000`** (see `frontend/vite.config.js`) and proxies `/api/*` requests through to the Express backend on port 5050 — so the Express server must also be running (`npm start` in another terminal, or the built server from step 2) for API calls to resolve during frontend-only dev.*

---

### 4. Testing on Mobile Devices (ngrok)
To test the PWA on an iPhone or Android phone:

1. Start your unified server: `npm run build`
2. In a second terminal window, run:
   ```bash
   ngrok http 5050
   ```
3. Open the `https://...` link on your mobile phone and select **"Add to Home Screen"** to test as a native PWA!

---

### 5. Workflow Note: Solo vs. Sharing

Hot reload (`npm run dev`) is **local-only** — it's for solo iteration on your own machine, not for sharing with teammates. LAN IP sharing (`http://<your-ip>:5050`) is unreliable on venue/hackathon WiFi due to client isolation and iOS-specific restrictions (Local Network permission, Private Relay, Wi-Fi Assist) that can silently block one device while another works fine.

So the split is:
- **Just for me, while coding:** `npm run dev` (HMR, fast iteration, not shared)
- **To share with teammates or test on phones:** `npm run build` + `ngrok http 5050` (static build, works over the public internet regardless of local network restrictions)

---

## ⚠️ Known Rough Edges

- **`server.js`'s "not built yet" fallback message references a `npm run quick-build` script that does not exist** in `package.json` — only `build-frontend`, `build`, `dev`, and `start` are defined. If you see "Frontend not built yet. Run ..." in the browser, run `npm run build` instead.
- **The PWA manifest is still generic hackathon branding**: `frontend/vite.config.js`'s `VitePWA` config sets `short_name: 'HackApp'` and `name: 'Hackathon PWA App'`, not anything Batam/Sustainable-Tourism-themed. Cosmetic — worth updating before this is shown to anyone outside the team, since it's what appears on a phone's home screen after "Add to Home Screen."

---

## 🛠️ Project Tooling

### Git Sync Helper
Automate fetching, rebasing, formatting conventional commits, and pushing changes to remote:

```bash
./.agents/skills/git/scripts/git-sync
```
