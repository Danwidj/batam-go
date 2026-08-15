export const USER = {
  name: 'Juliana',
  hasNotification: true
};

export const STEPS = {
  current: 8596,
  goal: 10000,
  distanceKm: 6.4,
  activeMinutes: 88
};

export const HERO_IMAGE = '/assets/places/batam-skyline-hero.jpg';

export const POPULAR = [
  { id: 'barelang', name: 'Barelang Bridge', distanceKm: 24, points: 250, image: '/assets/places/barelang-bridge.jpg' },
  { id: 'nongsa', name: 'Nongsa Beach', distanceKm: 18, points: 180, image: '/assets/places/nongsa-beach.jpg' },
  { id: 'mega-mall', name: 'Mega Mall Batam Centre', distanceKm: 6, points: 90, image: '/assets/places/mega-mall.jpg' },
  { id: 'masjid-agung', name: 'Masjid Agung Batam', distanceKm: 7, points: 100, image: '/assets/places/masjid-agung.jpg' },
  { id: 'tanjung-pinggir', name: 'Tanjung Pinggir Beach', distanceKm: 14, points: 150, image: '/assets/places/tanjung-pinggir.jpg' },
  { id: 'nagoya-hill', name: 'Nagoya Hill Mall', distanceKm: 9, points: 110, image: '/assets/places/nagoya-hill.jpg' }
];

export const MAP_PINS = [
  { id: 'bridge', icon: '🌉', top: '52%', left: '17%' },
  { id: 'city', icon: '🏙️', top: '25%', left: '78%' },
  { id: 'beach', icon: '🏝️', top: '59%', left: '49%' }
];

export const WEEKLY_STEPS = {
  current: 53000,
  goal: 70000,
  distanceKm: 41.6,
  activeMinutes: 612,
  changePct: 12,
  days: [
    { day: 'M', steps: 7000 },
    { day: 'T', steps: 8000 },
    { day: 'W', steps: 9000, isToday: true },
    { day: 'T', steps: 8000 },
    { day: 'F', steps: 8000 },
    { day: 'S', steps: 7000 },
    { day: 'S', steps: 6000 }
  ]
};

export const NEXT_REWARD = {
  stepsRemaining: 1404
};

export const ECO_IMPACT = {
  co2SavedKg: 3.8,
  carTripsAvoided: 2,
  treesEquivalent: 0.17
};

export const REWARDS = {
  stepCredits: 320,
  nextGoal: 75000,
  creditsAtNextGoal: 1000,
  milestones: [
    { threshold: 10000, credits: 100 },
    { threshold: 20000, credits: 250 },
    { threshold: 40000, credits: 500 },
    { threshold: 75000, credits: 1000 }
  ]
};

export const BADGES = [
  { id: 'trail-starter', name: 'Trail Starter', icon: '🥾', image: '/assets/badges/trail-starter.png', earned: true },
  { id: 'barelang-explorer', name: 'Barelang Explorer', icon: '🌉', image: '/assets/badges/barelang-explorer.png', earned: true },
  { id: 'island-hopper', name: 'Island Hopper', icon: '🏝️', image: '/assets/badges/island-hopper.png', earned: false },
  { id: 'eco-walker', name: 'Eco Walker', icon: '🌱', image: '/assets/badges/eco-walker.png', earned: true },
  { id: 'early-bird', name: 'Early Bird', icon: '🐦', image: '/assets/badges/early-bird.png', earned: false },
  { id: '50k-club', name: '50K Club', icon: '🏆', image: '/assets/badges/50k-club.png', earned: true }
];

