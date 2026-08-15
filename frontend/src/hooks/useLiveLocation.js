import { useEffect, useState } from 'react';

const BATAM_BOUNDS = { minLat: 1.0, maxLat: 1.25, minLng: 103.8, maxLng: 104.2 };
const DEFAULT_LOCATION = { lat: 1.141, lng: 104.019, label: 'Your location (Batam)' };

function isWithinBatamBounds(lat, lng) {
  return (
    lat > BATAM_BOUNDS.minLat &&
    lat < BATAM_BOUNDS.maxLat &&
    lng > BATAM_BOUNDS.minLng &&
    lng < BATAM_BOUNDS.maxLng
  );
}

export function useLiveLocation() {
  const [location, setLocation] = useState({ ...DEFAULT_LOCATION, error: null });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: 'unsupported' }));
      return undefined;
    }
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (isWithinBatamBounds(latitude, longitude)) {
          setLocation({ lat: latitude, lng: longitude, label: 'Your current location', error: null });
        }
      },
      (err) => {
        setLocation((prev) => ({
          ...prev,
          error: err.code === err.PERMISSION_DENIED ? 'permission-denied' : 'unavailable'
        }));
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
}
