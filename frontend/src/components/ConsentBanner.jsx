import { useState } from 'react';

const STORAGE_KEY = 'batam-go:location-consent-acknowledged';

export default function ConsentBanner() {
  const [acknowledged, setAcknowledged] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  if (acknowledged) return null;

  function handleAcknowledge() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore storage failures (private browsing, etc.)
    }
    setAcknowledged(true);
  }

  return (
    <div className="consent-banner" role="dialog" aria-label="Location use disclosure">
      <p className="consent-banner-text">
        Batam Go uses your device&apos;s location to show nearby points of interest, walking
        routes, and check-ins. Your browser will ask you to allow location access when needed —
        you can decline and still browse the app.
      </p>
      <button type="button" className="consent-banner-action" onClick={handleAcknowledge}>
        Got it
      </button>
    </div>
  );
}
