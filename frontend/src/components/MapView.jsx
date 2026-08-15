import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, ZoomControl } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { POIS, getCrowdStatus, CROWD_META, CROWD_LEGEND } from '../data/pois.js';
import { ROUTES, getRouteById } from '../data/routes.js';
import { haversineDistanceMeters } from '../utils/geo.js';

const CHECK_IN_RADIUS_M = 300;
const CHECK_IN_POI_ID = 'mangrove';
const CENTER = [1.1305, 104.035];
const WALK_DURATION_MS = 20000;

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

export default function MapView({ onVoucherEarned }) {
  const [selectedPoiId, setSelectedPoiId] = useState(null);
  const [savedPoiIds, setSavedPoiIds] = useState(() => new Set());
  const [selectedRouteId, setSelectedRouteId] = useState(ROUTES[0].id);
  const [checkIn, setCheckIn] = useState({ status: 'idle', message: '' });
  const [arrival, setArrival] = useState(null);
  const [walkState, setWalkState] = useState('idle');
  const [simulatedPosition, setSimulatedPosition] = useState(null);
  const animationRef = useRef(null);
  const walkStartRef = useRef(null);

  const checkInPoi = POIS.find((p) => p.id === CHECK_IN_POI_ID);
  const selectedPoi = POIS.find((p) => p.id === selectedPoiId) ?? null;
  const selectedRoute = getRouteById(selectedRouteId);

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    walkStartRef.current = null;
    setWalkState('idle');
    setSimulatedPosition(null);
  }, [selectedRouteId]);

  function startWalking() {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    const path = selectedRoute.path;
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

  function handleCheckIn() {
    if (walkState !== 'arrived') {
      setCheckIn({
        status: 'too-far',
        message: 'Finish walking the route first, then check in once you arrive.'
      });
      return;
    }
    const distance = haversineDistanceMeters(
      simulatedPosition[0],
      simulatedPosition[1],
      checkInPoi.lat,
      checkInPoi.lng
    );
    if (distance <= CHECK_IN_RADIUS_M) {
      setCheckIn({ status: 'success', message: `🌸 Checked in at the ${checkInPoi.name}!` });
      onVoucherEarned(checkInPoi.voucher);
      setArrival({ poiName: checkInPoi.name, points: selectedRoute.points });
    } else {
      setCheckIn({
        status: 'too-far',
        message: `You're ${(distance / 1000).toFixed(1)}km away — keep walking to get within ${CHECK_IN_RADIUS_M}m to check in.`
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
          center={CENTER}
          zoom={13}
          scrollWheelZoom
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          {POIS.map((poi) => (
            <Marker
              key={poi.id}
              position={[poi.lat, poi.lng]}
              icon={crowdIcon(getCrowdStatus(poi))}
              eventHandlers={{ click: () => setSelectedPoiId(poi.id) }}
            />
          ))}
          {ROUTES.map((route) => (
            <Polyline
              key={route.id}
              positions={route.path}
              pathOptions={{
                color: route.color,
                weight: route.id === selectedRouteId ? 6 : 3,
                opacity: route.id === selectedRouteId ? 0.9 : 0.35
              }}
            />
          ))}
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
            <button className="poi-card-close" onClick={() => setSelectedPoiId(null)} aria-label="Close">
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
            <div className="poi-tip-photo" />
          </div>

          <div className="poi-card-actions">
            <button className="poi-directions-btn" onClick={() => setSelectedPoiId(null)}>
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

      <div className="route-panel">
        <div className="route-panel-title">Choose your route</div>
        {ROUTES.map((route) => (
          <button
            key={route.id}
            className={`route-card ${route.id === selectedRouteId ? 'active' : ''}`}
            style={{ borderColor: route.id === selectedRouteId ? route.color : undefined }}
            onClick={() => setSelectedRouteId(route.id)}
          >
            <span className="route-card-icon" style={{ background: `${route.color}22`, color: route.color }}>
              {route.icon}
            </span>
            <span className="route-card-body">
              <span className="route-card-name">{route.name}</span>
              <span className="route-card-meta">
                {route.durationMin} min · {route.distanceKm} km
              </span>
              <span className="route-card-desc">{route.description}</span>
              <span className={`route-card-crowd route-card-crowd-${route.crowdLevel}`}>🧍 {route.crowdLabel}</span>
            </span>
            <span className="route-card-points">
              🌿 +{route.points}
              <br />
              <small>step credits</small>
            </span>
            <span className={`route-card-radio ${route.id === selectedRouteId ? 'checked' : ''}`}>
              {route.id === selectedRouteId ? '✓' : ''}
            </span>
          </button>
        ))}
      </div>

      <div className="checkin-panel">
        <div className="checkin-summary">
          {selectedRoute.name} · {selectedRoute.distanceKm} km
        </div>
        <button className="walk-btn" onClick={startWalking}>
          {walkState === 'walking'
            ? '🚶 Walking…'
            : walkState === 'arrived'
              ? '🔁 Walk again'
              : '🚶 Start walking'}
        </button>
        <button className="checkin-btn" onClick={handleCheckIn} disabled={walkState !== 'arrived'}>
          {walkState === 'arrived' ? `📍 Check In at ${checkInPoi.name}` : '🚶 Finish walking to check in'}
        </button>
        {checkIn.message && checkIn.status !== 'success' && (
          <p className={`checkin-message ${checkIn.status}`}>{checkIn.message}</p>
        )}
      </div>

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
