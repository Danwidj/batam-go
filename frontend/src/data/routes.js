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
      [1.129, 104.03],
      [1.13, 104.0345],
      [1.1315, 104.037],
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
      [1.1295, 104.0345],
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
      [1.126, 104.035],
      [1.1315, 104.0365],
      [1.1325, 104.04],
      [mangrove.lat, mangrove.lng]
    ]
  }
];

export function getRouteById(routeId) {
  return ROUTES.find((r) => r.id === routeId) ?? ROUTES[0];
}
