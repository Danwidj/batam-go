export const POIS = [
  {
    id: 'welcome-batam',
    name: 'Welcome to Batam Monument',
    category: 'Landmark',
    area: 'Bukit Clara, Teluk Tering',
    description: 'Iconic hilltop monument overlooking Batam Centre. Popular in the evenings with a local culinary market.',
    lat: 1.1215,
    lng: 104.0487,
    hoursLabel: 'Open 24 hours',
    rating: 4.5,
    reviewCount: 3820,
    tip: {
      title: 'Best time to visit',
      body: 'Come in the evening for the culinary night market and city views.'
    },
    crowdByHour: () => 'red'
  },

  {
    id: 'museum',
    name: 'Museum Batam Raja Ali Haji',
    category: 'Museum',
    area: 'Batam Centre',
    description: 'Quiet in the mornings, always worth an hour.',
    lat: 1.12951,
    lng: 104.05367,
    hoursLabel: 'Open today 09:00–17:00',
    rating: 4.3,
    reviewCount: 1204,
    tip: {
      title: 'Best time to visit',
      body: 'Weekday afternoons are moderately busy.'
    },
    crowdByHour: () => 'orange'
  },
  {
    id: 'mangrove',
    name: 'Mangrove Boardwalk',
    category: 'Nature reserve',
    area: 'Nongsa',
    description: 'Tour buses clear out by early afternoon.',
    lat: 1.133,
    lng: 104.0385,
    hoursLabel: 'Open today 07:00–18:00',
    rating: 4.6,
    reviewCount: 892,
    tip: {
      title: 'Best time to visit',
      body: 'After 12 PM once the tour buses clear out.'
    },
    crowdByHour: () => 'orange',
    voucher: {
      business: 'Kedai Kopi Akar',
      offer: '15% off any drink',
      code: 'MANGROVE-CHECKIN-001'
    }
  },
  {
    id: 'ferry-batam-centre',
    name: 'Batam Centre Ferry Terminal',
    category: 'Ferry terminal',
    area: 'Batam Centre',
    description: 'Main international ferry hub connecting Batam to Singapore and Malaysia.',
    lat: 1.1307,
    lng: 104.0552,
    hoursLabel: 'Open today 07:00–21:00',
    rating: 4.0,
    reviewCount: 5820,
    tip: {
      title: 'Travel tip',
      body: 'Arrive at least 30 minutes early for immigration clearance.'
    },
    crowdByHour: () => 'orange'
  },
  {
    id: 'mall',
    name: 'Mega Mall Batam Centre',
    category: 'Shopping mall',
    area: 'Batam Centre',
    description: 'Air-conditioned break with a food court and shops. Connected to the ferry terminal via a covered pedestrian bridge.',
    lat: 1.12924,
    lng: 104.05598,
    hoursLabel: 'Open today 10:00–22:00',
    rating: 4.2,
    reviewCount: 3150,
    tip: {
      title: 'Best time to visit',
      body: 'Pleasantly uncrowded throughout the morning and afternoon.'
    },
    crowdByHour: () => 'green'
  }
];

export function getCrowdStatus(poi, date = new Date()) {
  return poi.crowdByHour(date.getHours());
}

export const CROWD_META = {
  green: { label: 'Not crowded', badge: 'Not crowded', color: '#2e7d32' },
  orange: { label: 'Slightly crowded', badge: 'Slightly crowded now', color: '#ef6c00' },
  red: { label: 'Very crowded', badge: 'Very crowded now', color: '#c62828' }
};

export const CROWD_LEGEND = ['green', 'orange', 'red'].map((status) => ({
  status,
  ...CROWD_META[status]
}));
