export const INITIAL_VOUCHERS = [
  {
    id: 'welcome',
    business: 'Warung Pantai',
    offer: '10% off your first meal',
    code: 'WELCOME-STE-001'
  }
];

// Rewards Shop — points economy (matches Canva wireframe "Batam Hackathon", Shop flow)
export const INITIAL_POINTS_BALANCE = 2850;
export const POINTS_RATE_LABEL = '500 pts = Rp5.000';
export const MAX_VOUCHERS_PER_REDEMPTION = 5;

export const VOUCHER_CATEGORIES = [
  { id: 'food', label: 'Food', icon: '🔔', note: 'Valid at selected eateries' },
  { id: 'activities', label: 'Activities', icon: '⛰️', note: 'Valid at selected activities' },
  { id: 'stay', label: 'Stay', icon: '🏨', note: 'Valid at selected stays' }
];

export const REWARD_TIERS = [
  { id: 'food-5k', categoryId: 'food', value: 'Rp5.000', pointsCost: 500 },
  { id: 'food-10k', categoryId: 'food', value: 'Rp10.000', pointsCost: 1000 },
  { id: 'food-25k', categoryId: 'food', value: 'Rp25.000', pointsCost: 2500 },
  { id: 'food-50k', categoryId: 'food', value: 'Rp50.000', pointsCost: 5000 },
  { id: 'activities-25k', categoryId: 'activities', value: 'Rp25.000', pointsCost: 2500 },
  { id: 'stay-50k', categoryId: 'stay', value: 'Rp50.000', pointsCost: 5000 }
];

// "My Vouchers" starting holdings — mirrors the wireframe's 3 Food / 2 Activities / 1 Stay counts
export const INITIAL_MY_VOUCHERS = [
  { id: 'mv-food-5k', tierId: 'food-5k', categoryId: 'food', value: 'Rp5.000', pointsCost: 500, quantity: 2, expires: 'Expires 30 Sep' },
  { id: 'mv-food-10k', tierId: 'food-10k', categoryId: 'food', value: 'Rp10.000', pointsCost: 1000, quantity: 1, expires: 'Expires 30 Sep' },
  { id: 'mv-activities-25k', tierId: 'activities-25k', categoryId: 'activities', value: 'Rp25.000', pointsCost: 2500, quantity: 2, expires: 'Expires 15 Oct' },
  { id: 'mv-stay-50k', tierId: 'stay-50k', categoryId: 'stay', value: 'Rp50.000', pointsCost: 5000, quantity: 1, expires: 'Expires 31 Oct' }
];

// "Use Food Voucher" — participating local eateries near the visitor
export const FOOD_SPOTS = [
  { id: 'harbour-seafood', name: 'Harbour Seafood', rating: 4.8, distanceKm: 1.2 },
  { id: 'nagoya-food-corner', name: 'Nagoya Food Corner', rating: 4.7, distanceKm: 1.8 },
  { id: 'batam-kopitiam', name: 'Batam Kopitiam', rating: 4.6, distanceKm: 2.1 },
  { id: 'golden-prawn-kitchen', name: 'Golden Prawn Kitchen', rating: 4.5, distanceKm: 2.6 }
];
