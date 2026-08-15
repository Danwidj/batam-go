export const POIS = [
  {
    id: 'museum',
    name: 'History Museum',
    category: 'Museum',
    area: 'Batam Centre',
    description: 'Quiet in the mornings, always worth an hour.',
    lat: 1.1275,
    lng: 104.032,
    hoursLabel: 'Open today 09:00–17:00',
    rating: 4.3,
    reviewCount: 1204,
    tip: {
      title: 'Best time to visit',
      body: 'Weekday mornings are quietest.'
    },
    crowdByHour: () => 'green'
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
    crowdByHour: (hour) => (hour >= 6 && hour < 12 ? 'red' : 'green'),
    voucher: {
      business: 'Kedai Kopi Akar',
      offer: '15% off any drink',
      code: 'MANGROVE-CHECKIN-001'
    }
  },
  {
    id: 'mall',
    name: 'Mega Mall Batam Centre',
    category: 'Shopping mall',
    area: 'Batam Centre',
    description: 'Air-conditioned break with a food court and shops.',
    lat: 1.1295,
    lng: 104.03,
    hoursLabel: 'Open today 10:00–22:00',
    rating: 4.2,
    reviewCount: 3150,
    tip: {
      title: 'Best time to visit',
      body: 'Weekday afternoons, before the evening rush.'
    },
    crowdByHour: () => 'orange'
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
