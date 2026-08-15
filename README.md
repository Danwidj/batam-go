# Batam Go - Sustainable Tourism Explorer

## Problem Statement

New international ports and tourism SEZ drive growth, but over-tourism risks mangroves, traffic, and cultural sites. Visitors (many from Singapore) lack integrated, sustainable itineraries or real-time eco-impact tools.

---

## Solution

Production URL: https://batam-go.vercel.app

Batam Go is a mobile-first Progressive Web App (PWA) that transforms sustainable tourism into a gamified, reward-driven experience. It directly tackles over-tourism and fragmented visitor itineraries through four core feature pillars:

- **Crowd-Aware Navigation and Smart Routing**: Live crowd-density indicators (Low, Moderate, High) guide tourists away from congested hotspots toward eco-friendly walking paths, offering higher point multipliers for low-crowd routes.
- **Gamified Walk-to-Earn Mechanics**: Encourages sustainable foot travel by converting completed walking routes and milestone steps into redeemable reward credits with interactive route simulations and geofenced destination check-ins.
- **Hyper-Local Rewards Marketplace**: Points convert into instant, scannable digital QR vouchers redeemable exclusively at local eateries, community activities, and eco-stays to circulate tourism spend into local businesses.
- **Personal Eco-Impact and Carbon Telemetry**: Provides real-time visibility into personal sustainability contributions, calculating estimated CO2 saved, vehicle trips avoided, and activity streak milestones.

---

## Installing as an App (PWA)

Batam Go can be installed directly onto your mobile home screen without an app store:

### iOS (Safari)
1. Open https://batam-go.vercel.app in Safari.
2. Tap the **Share** button (the square with an arrow pointing up).
3. Scroll down and select **Add to Home Screen**.
4. Tap **Add** in the top right corner.

### Android (Chrome)
1. Open https://batam-go.vercel.app in Chrome.
2. Tap the **Menu** icon (three vertical dots in the upper right).
3. Tap **Install app** or **Add to Home screen**.
4. Follow the on-screen prompt to confirm installation.

---

## Quick Start (Local Build)

### 1. Install dependencies

```bash
npm install
```

### 2. Development mode (Hot Reload)

```bash
npm run dev
```

Runs the frontend development server on `http://localhost:3000`.

### 3. Production build and local server

```bash
npm run build
```

Builds the frontend bundle and starts the local Node.js server on `http://localhost:5050`.
