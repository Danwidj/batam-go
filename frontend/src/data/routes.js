import { POIS } from './pois.js';

const museum = POIS.find((p) => p.id === 'museum');
const mangrove = POIS.find((p) => p.id === 'mangrove');

export const ROUTES = [
  {
    id: 'scenic',
    name: 'Scenic Park Route',
    description: 'Quieter path via Alun-Alun',
    icon: '🌳',
    color: '#2e7d32',
    crowdLevel: 'green',
    crowdLabel: 'Low crowds',
    durationMin: 18,
    distanceKm: 1.3,
    points: 220,
    co2SavedG: 480,
    path: [
      [museum.lat, museum.lng],
      [1.135, 104.062],
      [1.145, 104.078],
      [1.155, 104.09],
      [mangrove.lat, mangrove.lng]
    ]
  },
  {
    id: 'direct',
    name: 'Direct Route',
    description: 'Fastest route via Jl. Engku Putri',
    icon: '🏃',
    color: '#ef6c00',
    crowdLevel: 'orange',
    crowdLabel: 'Moderate crowds',
    durationMin: 12,
    distanceKm: 0.9,
    points: 140,
    co2SavedG: 200,
    path: [
      [museum.lat, museum.lng],
      [1.14, 104.065],
      [1.15, 104.085],
      [mangrove.lat, mangrove.lng]
    ]
  },
  {
    id: 'mosque',
    name: 'Mosque Loop',
    description: 'Via Masjid Agung Batam',
    icon: '🕌',
    color: '#c62828',
    crowdLevel: 'red',
    crowdLabel: 'High crowds',
    durationMin: 22,
    distanceKm: 1.6,
    points: 80,
    co2SavedG: 0,
    path: [
      [museum.lat, museum.lng],
      [1.128, 104.055],
      [1.135, 104.07],
      [1.148, 104.088],
      [mangrove.lat, mangrove.lng]
    ]
  }
];

export function getRouteById(routeId) {
  return ROUTES.find((r) => r.id === routeId) ?? ROUTES[0];
}
