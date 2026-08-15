import { divIcon } from 'leaflet';

export function crowdIcon(status, meta) {
  const color = meta[status].color;
  return divIcon({
    className: '',
    html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

export function spotMarkerIcon(isSelected) {
  const color = isSelected ? '#16a34a' : '#2563eb';
  const size = isSelected ? 22 : 16;
  return divIcon({
    className: '',
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:bold;">${isSelected ? '🍽️' : ''}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

export function userLocationIcon() {
  return divIcon({
    className: '',
    html: `<div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
      <span style="position:absolute;width:100%;height:100%;border-radius:50%;background:#3b82f6;opacity:0.35;"></span>
      <span style="position:relative;width:14px;height:14px;border-radius:50%;background:#2563eb;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.4);"></span>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}
