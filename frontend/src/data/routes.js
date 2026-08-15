import { POIS } from './pois.js';

const ferry = POIS.find((p) => p.id === 'ferry-batam-centre');
const mangrove = POIS.find((p) => p.id === 'mangrove');

export const ROUTES = [];

export function getRouteById(routeId) {
  return ROUTES.find((r) => r.id === routeId) ?? null;
}
