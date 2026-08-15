import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, ZoomControl, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { POIS, getCrowdStatus, CROWD_META, CROWD_LEGEND } from '../data/pois.js';
import { haversineDistanceMeters } from '../utils/geo.js';

const CHECK_IN_RADIUS_M = 300;
const CHECK_IN_POI_ID = 'mangrove';
const HARRIS_HOTEL_LOCATION = { lat: 1.1304, lng: 104.0538 };
const CENTER = [1.1304, 104.0538];
const WALK_DURATION_MS = 20000;
const ROUTE_COLORS = ['#2e7d32', '#ef6c00', '#c62828'];
const ROUTE_LABELS = ['🟢 Low crowds', '🟡 Moderate crowds', '🔴 High crowds'];

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (position?.lat && position?.lng) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);
  return null;
}

function crowdIcon(status) {
  const color = CROWD_META[status].color;
  return divIcon({
    className: '',
    html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

function walkerIcon() {
  return divIcon({
    className: '',
    html: '<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:#1565c0;border:3px solid white;box-shadow:0 0 6px rgba(0,0,0,0.5);font-size:14px;">🧍</span>',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
}

function youAreHereIcon() {
  return divIcon({
    className: '',
    html: `
      <div class="you-are-here-marker">
        <div class="you-are-here-ring"></div>
        <div class="you-are-here-ring"></div>
        <div class="you-are-here-dot">YOU</div>
      </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
}

function pointAlongPath(path, t) {
  if (path.length === 1) return path[0];
  const segmentLengths = [];
  let totalLength = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const length = haversineDistanceMeters(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1]);
    segmentLengths.push(length);
    totalLength += length;
  }
  if (totalLength === 0) return path[0];

  let target = t * totalLength;
  for (let i = 0; i < segmentLengths.length; i++) {
    if (target <= segmentLengths[i]) {
      const frac = segmentLengths[i] === 0 ? 0 : target / segmentLengths[i];
      const [lat1, lng1] = path[i];
      const [lat2, lng2] = path[i + 1];
      return [lat1 + (lat2 - lat1) * frac, lng1 + (lng2 - lng1) * frac];
    }
    target -= segmentLengths[i];
  }
  return path[path.length - 1];
}

/**
 * Compute a waypoint offset perpendicularly from the midpoint of from→to.
 * offsetMeters > 0 = left side, < 0 = right side.
 */
function computeWaypoint(from, to, offsetMeters) {
  const midLat = (from.lat + to.lat) / 2;
  const midLng = (from.lng + to.lng) / 2;
  const dLat = to.lat - from.lat;
  const dLng = to.lng - from.lng;
  // Rotate 90° to get perpendicular
  const perpLat = -dLng;
  const perpLng = dLat;
  const len = Math.sqrt(perpLat * perpLat + perpLng * perpLng);
  if (len === 0) return { lat: midLat, lng: midLng };
  // Convert metres to degrees
  const latPerM = 1 / 111111;
  const lngPerM = 1 / (111111 * Math.cos(midLat * Math.PI / 180));
  return {
    lat: midLat + (perpLat / len) * offsetMeters * latPerM,
    lng: midLng + (perpLng / len) * offsetMeters * lngPerM
  };
}

export default function MapView({ onVoucherEarned }) {
  const [selectedPoiId, setSelectedPoiId] = useState(null);
  const [targetPoi, setTargetPoi] = useState(null);
  const [savedPoiIds, setSavedPoiIds] = useState(() => new Set());
  const [routeVisible, setRouteVisible] = useState(false);
  const [userPosition, setUserPosition] = useState(HARRIS_HOTEL_LOCATION);
  const [osrmRoutes, setOsrmRoutes] = useState([]); // sorted by distance: [shortest→green, mid→orange, longest→red]
  const [selectedOsrmIndex, setSelectedOsrmIndex] = useState(0);
  const [osrmLoading, setOsrmLoading] = useState(false);
  const [checkIn, setCheckIn] = useState({ status: 'idle', message: '' });
  const [arrival, setArrival] = useState(null);
  const [walkState, setWalkState] = useState('idle');
  const [simulatedPosition, setSimulatedPosition] = useState(null);
  const animationRef = useRef(null);
  const walkStartRef = useRef(null);

  const selectedPoi = POIS.find((p) => p.id === selectedPoiId) ?? null;

  // Track user's actual GPS location directly from device
  useEffect(() => {
    if (!navigator.geolocation) return;

    // Get initial fix immediately
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPosition({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.warn('Geolocation initial fix failed:', err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Watch live location updates
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPosition({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.warn('Geolocation live watch failed:', err);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedPoiId) return; // deselecting POI shouldn't wipe routes
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    walkStartRef.current = null;
    setWalkState('idle');
    setSimulatedPosition(null);
    setOsrmRoutes([]);
    setSelectedOsrmIndex(0);
    setCheckIn({ status: 'idle', message: '' });
  }, [selectedPoiId]);

  function startWalking() {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    const path = osrmRoutes[selectedOsrmIndex]?.path;
    if (!path) return;
    walkStartRef.current = null;
    setWalkState('walking');
    setSimulatedPosition(path[0]);

    function step(timestamp) {
      if (walkStartRef.current === null) {
        walkStartRef.current = timestamp;
      }
      const elapsed = timestamp - walkStartRef.current;
      const t = Math.min(elapsed / WALK_DURATION_MS, 1);
      setSimulatedPosition(pointAlongPath(path, t));
      if (t < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        animationRef.current = null;
        setWalkState('arrived');
      }
    }
    animationRef.current = requestAnimationFrame(step);
  }

  function toggleSave(poiId) {
    setSavedPoiIds((prev) => {
      const next = new Set(prev);
      if (next.has(poiId)) {
        next.delete(poiId);
      } else {
        next.add(poiId);
      }
      return next;
    });
  }

  async function fetchOsrmRoute(poi) {
    if (!poi) return;
    setOsrmLoading(true);
    setOsrmRoutes([]);
    setSelectedOsrmIndex(0);
    try {
      const start = userPosition;
      // Generate two perpendicular waypoints to force OSRM down different roads
      const wpLeft  = computeWaypoint(start, poi,  150); // ~150m left of direct line
      const wpRight = computeWaypoint(start, poi, -200); // ~200m right of direct line

      const base   = 'https://router.project-osrm.org/route/v1/foot';
      const params = '?overview=full&geometries=geojson';
      const origin = `${start.lng},${start.lat}`;
      const destination = `${poi.lng},${poi.lat}`;
      const wl = `${wpLeft.lng},${wpLeft.lat}`;
      const wr = `${wpRight.lng},${wpRight.lat}`;

      const [d1, d2, d3] = await Promise.all([
        fetch(`${base}/${origin};${destination}${params}`).then(r => r.json()),
        fetch(`${base}/${origin};${wl};${destination}${params}`).then(r => r.json()),
        fetch(`${base}/${origin};${wr};${destination}${params}`).then(r => r.json()),
      ]);

      const raw = [d1.routes?.[0], d2.routes?.[0], d3.routes?.[0]].filter(Boolean);
      raw.sort((a, b) => a.distance - b.distance); // shortest first → green (low crowds)

      // Points are INVERSELY proportional to crowd level:
      // 🟢 Low crowds → 1.5× pts  (reward avoiding busy areas)
      // 🟡 Moderate   → 1.0× pts
      // 🔴 High crowds → 0.5× pts  (discourage crowded routes)
      const CROWD_MULTIPLIERS = [1.5, 1.0, 0.5];

      const routes = raw.map((route, i) => ({
        path: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        durationMin: Math.round(route.duration / 60),
        distanceKm: (route.distance / 1000).toFixed(2),
        color: ROUTE_COLORS[i] ?? ROUTE_COLORS[2],
        label: ROUTE_LABELS[i] ?? ROUTE_LABELS[2],
        points: Math.round((route.distance / 10) * (CROWD_MULTIPLIERS[i] ?? 0.5))
      }));

      setOsrmRoutes(routes);
    } catch (err) {
      console.error('OSRM fetch failed:', err);
    } finally {
      setOsrmLoading(false);
    }
  }

  function handleCheckIn() {
    if (walkState !== 'arrived') {
      setCheckIn({
        status: 'too-far',
        message: 'Finish walking the route first, then check in once you arrive.'
      });
      return;
    }
    const dest = targetPoi || selectedPoi;
    if (!dest || !simulatedPosition) return;
    const activeRoute = osrmRoutes[selectedOsrmIndex];
    const distance = haversineDistanceMeters(
      simulatedPosition[0],
      simulatedPosition[1],
      dest.lat,
      dest.lng
    );
    const POINTS = activeRoute?.points ?? 50;
    if (distance <= CHECK_IN_RADIUS_M) {
      setCheckIn({ status: 'success', message: `✅ Checked in at ${dest.name}!` });
      if (dest.voucher) onVoucherEarned(dest.voucher);
      setArrival({ poiName: dest.name, points: POINTS });
    } else {
      setCheckIn({
        status: 'too-far',
        message: `You're ${(distance / 1000).toFixed(1)}km away — get within ${CHECK_IN_RADIUS_M}m to check in.`
      });
    }
  }

  function handleClaim() {
    setArrival(null);
    setCheckIn({ status: 'idle', message: '' });
  }

  return (
    <div className="map-view">
      <div className="map-container-wrap">
        <MapContainer
          center={[userPosition.lat, userPosition.lng]}
          zoom={15}
          scrollWheelZoom
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <RecenterMap position={userPosition} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <Marker
            position={[userPosition.lat, userPosition.lng]}
            icon={youAreHereIcon()}
            zIndexOffset={2000}
          />
          {POIS.map((poi) => (
            <Marker
              key={poi.id}
              position={[poi.lat, poi.lng]}
              icon={crowdIcon(getCrowdStatus(poi))}
              eventHandlers={{
                click: () => {
                  setSelectedPoiId(poi.id);
                }
              }}
            />
          ))}
          {/* Render non-selected routes in the background */}
          {osrmRoutes.map((route, i) => {
            if (i === selectedOsrmIndex) return null;
            return (
              <Polyline
                key={`inactive-${i}`}
                positions={route.path}
                pathOptions={{
                  color: route.color,
                  weight: 4,
                  opacity: 0.75,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedOsrmIndex(i);
                    setWalkState('idle');
                    setSimulatedPosition(null);
                  }
                }}
              />
            );
          })}
          {/* Render selected route on top with crisp casing outline */}
          {osrmRoutes[selectedOsrmIndex] && (
            <>
              <Polyline
                key={`active-casing-${selectedOsrmIndex}`}
                positions={osrmRoutes[selectedOsrmIndex].path}
                pathOptions={{
                  color: '#ffffff',
                  weight: 9,
                  opacity: 0.9,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              <Polyline
                key={`active-${selectedOsrmIndex}`}
                positions={osrmRoutes[selectedOsrmIndex].path}
                pathOptions={{
                  color: osrmRoutes[selectedOsrmIndex].color,
                  weight: 6,
                  opacity: 1,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            </>
          )}
          {simulatedPosition && <Marker position={simulatedPosition} icon={walkerIcon()} zIndexOffset={1000} />}
        </MapContainer>

        <div className="crowd-legend">
          {CROWD_LEGEND.map((item) => (
            <div className="crowd-legend-row" key={item.status}>
              <span className="crowd-dot" style={{ background: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {selectedPoi && (
        <div className="poi-card">
          <div className="poi-card-handle" />
          <div className="poi-card-header">
            <div>
              <h3 className="poi-card-title">{selectedPoi.name}</h3>
              <p className="poi-card-subtitle">
                {selectedPoi.category} · {selectedPoi.area}
              </p>
            </div>
            <button className="poi-card-close" onClick={() => { setSelectedPoiId(null); setRouteVisible(false); }} aria-label="Close">
              ✕
            </button>
          </div>

          <div className="poi-card-badges">
            <span className={`poi-badge poi-badge-${getCrowdStatus(selectedPoi)}`}>
              🧍 {CROWD_META[getCrowdStatus(selectedPoi)].badge}
            </span>
            <span className="poi-badge">🕒 {selectedPoi.hoursLabel}</span>
          </div>

          <div className="poi-card-rating">
            ⭐ {selectedPoi.rating} <span className="poi-card-reviews">({selectedPoi.reviewCount.toLocaleString()} reviews)</span>
          </div>

          <div className="poi-tip">
            <span className="poi-tip-icon">📍</span>
            <div className="poi-tip-text">
              <strong>{selectedPoi.tip.title}</strong>
              <p>{selectedPoi.tip.body}</p>
            </div>
          </div>

          <div className="poi-card-actions">
            <button className="poi-directions-btn" onClick={() => {
                setTargetPoi(selectedPoi);
                setRouteVisible(true);
                fetchOsrmRoute(selectedPoi);
                setSelectedPoiId(null);
              }}>
              🧭 Directions
            </button>
            <button
              className={`poi-save-btn ${savedPoiIds.has(selectedPoi.id) ? 'saved' : ''}`}
              onClick={() => toggleSave(selectedPoi.id)}
            >
              🔖 {savedPoiIds.has(selectedPoi.id) ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {routeVisible && (osrmLoading || osrmRoutes.length > 0) && (
        <div className="route-panel">
          {osrmLoading ? (
            <div className="route-panel-title">🔄 Finding walking routes…</div>
          ) : (
            <>
              <div className="route-panel-title">🚶 Choose a route to {targetPoi?.name}</div>
              {osrmRoutes.map((route, i) => (
                <button
                  key={i}
                  className={`osrm-route-card-btn ${i === selectedOsrmIndex ? 'active' : ''}`}
                  style={{ borderColor: i === selectedOsrmIndex ? route.color : 'transparent' }}
                  onClick={() => { setSelectedOsrmIndex(i); setWalkState('idle'); setSimulatedPosition(null); }}
                >
                  <span className="osrm-route-color-dot" style={{ background: route.color }} />
                  <span className="osrm-route-card-body">
                    <span className="osrm-route-card-label">{route.label}</span>
                    <span className="osrm-route-card-meta">⏱ {route.durationMin} min · 📍 {route.distanceKm} km</span>
                  </span>
                  <span className="osrm-route-card-pts" style={{ color: route.color }}>🌿 +{route.points} pts</span>
                  {i === selectedOsrmIndex && <span className="osrm-route-card-check">✓</span>}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {routeVisible && osrmRoutes.length > 0 && (
        <div className="checkin-panel">
          <div className="checkin-summary">
            {targetPoi?.name || selectedPoi?.name} · {osrmRoutes[selectedOsrmIndex]?.distanceKm} km
          </div>
          <button className="walk-btn" onClick={startWalking}>
            {walkState === 'walking'
              ? '🚶 Walking…'
              : walkState === 'arrived'
                ? '🔁 Walk again'
                : '🚶 Start walking'}
          </button>
          <button className="checkin-btn" onClick={handleCheckIn} disabled={walkState !== 'arrived'}>
            {walkState === 'arrived' ? `📍 Check In at ${targetPoi?.name || selectedPoi?.name}` : '🚶 Finish walking to check in'}
          </button>
          {checkIn.message && checkIn.status !== 'success' && (
            <p className={`checkin-message ${checkIn.status}`}>{checkIn.message}</p>
          )}
        </div>
      )}

      {arrival && (
        <div className="arrival-overlay">
          <div className="arrival-modal">
            <div className="arrival-icon">✅</div>
            <h2 className="arrival-title">You've arrived!</h2>
            <p className="arrival-poi-name">{arrival.poiName}</p>
            <p className="arrival-desc">Your journey is complete.</p>
            <div className="arrival-points-box">
              <div className="arrival-points-label">POINTS EARNED</div>
              <div className="arrival-points-value">{arrival.points} pts</div>
            </div>
            <button className="arrival-claim-btn" onClick={handleClaim}>
              Claim {arrival.points} pts
            </button>
            <p className="arrival-footnote">Points will be added to your balance.</p>
          </div>
        </div>
      )}
    </div>
  );
}
