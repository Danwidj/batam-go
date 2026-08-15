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

export const POPULAR = [
  { id: 'barelang', name: 'Barelang Bridge', distanceKm: 24, points: 250 },
  { id: 'nongsa', name: 'Nongsa Beach', distanceKm: 18, points: 180 }
];

export const MAP_PINS = [
  { id: 'bridge', icon: '🌉', top: '52%', left: '17%' },
  { id: 'city', icon: '🏙️', top: '25%', left: '78%' },
  { id: 'beach', icon: '🏝️', top: '59%', left: '49%' }
];

export const WEEKLY_STEPS = {
  current: 52430,
  goal: 70000,
  distanceKm: 41.6,
  activeMinutes: 612,
  changePct: 12,
  days: [
    { day: 'M', steps: 6900 },
    { day: 'T', steps: 7550 },
    { day: 'W', steps: 8596, isToday: true },
    { day: 'T', steps: 7800 },
    { day: 'F', steps: 8100 },
    { day: 'S', steps: 7200 },
    { day: 'S', steps: 6284 }
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
  { id: 'trail-starter', name: 'Trail Starter', icon: '🥾', earned: true },
  { id: 'barelang-explorer', name: 'Barelang Explorer', icon: '🌉', earned: true },
  { id: 'island-hopper', name: 'Island Hopper', icon: '🏝️', earned: false },
  { id: 'eco-walker', name: 'Eco Walker', icon: '🌱', earned: true },
  { id: 'early-bird', name: 'Early Bird', icon: '🐦', earned: false },
  { id: '50k-club', name: '50K Club', icon: '🏆', earned: true }
];
