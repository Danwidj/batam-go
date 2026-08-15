import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, ZoomControl } from 'react-leaflet';
import { DESTINATIONS, getCrowdStatus, CROWD_META, CROWD_LEGEND } from '../data/destinations.js';
import { haversineDistanceMeters } from '../utils/geo.js';
import { crowdIcon, userLocationIcon } from '../utils/mapIcons.js';
import { useLiveLocation } from '../hooks/useLiveLocation.js';

const CHECK_IN_RADIUS_M = 300;
const CENTER = [1.124, 104.0515];

export default function MapView({ onVoucherEarned }) {
  const [selectedDestId, setSelectedDestId] = useState(null);
  const [savedPoiIds, setSavedPoiIds] = useState(() => new Set());
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [checkIn, setCheckIn] = useState({ status: 'idle', message: '' });
  const [arrival, setArrival] = useState(null);

  const liveLocation = useLiveLocation();

  const selectedDest = DESTINATIONS.find((d) => d.poi.id === selectedDestId) ?? null;
  const selectedRoute = selectedDest
    ? selectedDest.routes.find((r) => r.id === selectedRouteId) ?? selectedDest.routes[0]
    : null;

  function chooseDestination(destId) {
    const dest = DESTINATIONS.find((d) => d.poi.id === destId);
    setSelectedDestId(destId);
    setSelectedRouteId(dest?.routes[0]?.id ?? null);
    setCheckIn({ status: 'idle', message: '' });
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
    if (!selectedDest) return;
    if (liveLocation.error) {
      const errorMessages = {
        unsupported: 'Geolocation is not supported on this device — check-in needs location access.',
        'permission-denied': 'Location permission is blocked — enable it in your browser settings to check in.',
        unavailable: "Couldn't get an accurate location fix — move somewhere with a clearer signal and try again."
      };
      setCheckIn({
        status: 'location-error',
        message: errorMessages[liveLocation.error] ?? errorMessages.unavailable
      });
      return;
    }
    const distance = haversineDistanceMeters(
      liveLocation.lat,
      liveLocation.lng,
      selectedDest.poi.lat,
      selectedDest.poi.lng
    );
    if (distance <= CHECK_IN_RADIUS_M) {
      setCheckIn({ status: 'success', message: `🌸 Checked in at the ${selectedDest.poi.name}!` });
      if (selectedDest.poi.voucher) {
        onVoucherEarned(selectedDest.poi.voucher);
      }
      setArrival({ poiName: selectedDest.poi.name, points: selectedRoute.points });
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
          center={CENTER}
          zoom={14}
          scrollWheelZoom
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          {DESTINATIONS.map(({ poi }) => (
            <Marker
              key={poi.id}
              position={[poi.lat, poi.lng]}
              icon={crowdIcon(getCrowdStatus(poi), CROWD_META)}
              eventHandlers={{ click: () => chooseDestination(poi.id) }}
            />
          ))}
          <Marker position={[liveLocation.lat, liveLocation.lng]} icon={userLocationIcon()} />
          {selectedDest &&
            selectedDest.routes.map((route) => (
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

      {!selectedDest && (
        <div className="dest-picker">
          <div className="dest-picker-title">Where are you walking to?</div>
          <div className="dest-picker-row">
            {DESTINATIONS.map(({ poi }) => (
              <button key={poi.id} className="dest-picker-chip" onClick={() => chooseDestination(poi.id)}>
                <span
                  className="dest-picker-dot"
                  style={{ background: CROWD_META[getCrowdStatus(poi)].color }}
                />
                {poi.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDest && (
        <div className="poi-card">
          <div className="poi-card-handle" />
          <div className="poi-card-header">
            <div>
              <h3 className="poi-card-title">{selectedDest.poi.name}</h3>
              <p className="poi-card-subtitle">
                {selectedDest.poi.category} · {selectedDest.poi.area}
              </p>
            </div>
            <button className="poi-card-close" onClick={() => setSelectedDestId(null)} aria-label="Close">
              ✕
            </button>
          </div>

          <div className="poi-card-badges">
            <span className={`poi-badge poi-badge-${getCrowdStatus(selectedDest.poi)}`}>
              🧍 {CROWD_META[getCrowdStatus(selectedDest.poi)].badge}
            </span>
            <span className="poi-badge">🕒 {selectedDest.poi.hoursLabel}</span>
          </div>

          <div className="poi-card-rating">
            ⭐ {selectedDest.poi.rating}{' '}
            <span className="poi-card-reviews">({selectedDest.poi.reviewCount.toLocaleString()} reviews)</span>
          </div>

          <div className="poi-tip">
            <span className="poi-tip-icon">📍</span>
            <div className="poi-tip-text">
              <strong>{selectedDest.poi.tip.title}</strong>
              <p>{selectedDest.poi.tip.body}</p>
            </div>
            <div className="poi-tip-photo" />
          </div>

          <div className="poi-card-actions">
            <button className="poi-directions-btn" onClick={() => setSelectedDestId(null)}>
              🧭 Change destination
            </button>
            <button
              className={`poi-save-btn ${savedPoiIds.has(selectedDest.poi.id) ? 'saved' : ''}`}
              onClick={() => toggleSave(selectedDest.poi.id)}
            >
              🔖 {savedPoiIds.has(selectedDest.poi.id) ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {selectedDest && (
        <div className="route-panel">
          <div className="route-panel-title">Choose your route</div>
          {selectedDest.routes.map((route) => (
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
      )}

      {selectedDest && (
        <div className="checkin-panel">
          <div className="checkin-summary">
            {selectedRoute.name} · {selectedRoute.distanceKm} km
          </div>
          <button className="checkin-btn" onClick={handleCheckIn}>
            📍 Check In at {selectedDest.poi.name}
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
