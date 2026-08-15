import { useState } from 'react';

const STORAGE_KEY = 'batam-go:location-consent';

export default function ConsentBanner() {
  const [consent, setConsent] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY); // 'granted' | 'denied' | null
    } catch {
      return null;
    }
  });

  function handleAllow() {
    try {
      localStorage.setItem(STORAGE_KEY, 'granted');
    } catch {
      // ignore storage failures
    }
    setConsent('granted');
  }

  function handleDeny() {
    try {
      localStorage.setItem(STORAGE_KEY, 'denied');
    } catch {
      // ignore storage failures
    }
    setConsent('denied');
  }

  if (consent === 'granted') {
    return null;
  }

  if (consent === 'denied') {
    return (
      <div className="location-denied-screen">
        <div className="location-denied-card">
          <div className="location-denied-icon">📍</div>
          <h2 className="location-denied-title">Location Access Required</h2>
          <p className="location-denied-text">
            Batam Go needs your device location to provide crowd-aware navigation, calculate green points, and unlock local check-in rewards.
          </p>
          <p className="location-denied-warning">
            The application cannot work without location permission.
          </p>
          <button type="button" className="location-denied-retry-btn" onClick={handleAllow}>
            Allow Location Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="consent-banner" role="dialog" aria-label="Location permission disclosure">
      <p className="consent-banner-text">
        <strong>📍 Enable Location for Batam Go?</strong>
        <br />
        Batam Go uses your location to show nearby points of interest, walking routes, and check-in rewards.
      </p>
      <div className="consent-banner-actions">
        <button type="button" className="consent-banner-btn-deny" onClick={handleDeny}>
          No
        </button>
        <button type="button" className="consent-banner-btn-allow" onClick={handleAllow}>
          Yes, Allow
        </button>
      </div>
    </div>
  );
}
