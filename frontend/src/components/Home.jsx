import { USER, STEPS, POPULAR, MAP_PINS } from '../data/home-mock.js';

export default function Home() {
  const stepsPct = Math.min(100, Math.round((STEPS.current / STEPS.goal) * 100));

  return (
    <div className="home-view">
      <div className="home-header">
        <div className="home-avatar" />
        <div className="home-greeting">Good morning, {USER.name}</div>
        <div className="home-bell">
          🔔
          {USER.hasNotification && <span className="home-bell-dot" />}
        </div>
      </div>

      <div className="home-hero">
        <div className="home-hero-title">Explore Batam</div>
        <div className="home-hero-art">
          {MAP_PINS.map((pin) => (
            <div className="home-hero-pin" style={{ top: pin.top, left: pin.left }} key={pin.id}>
              <span>{pin.icon}</span>
            </div>
          ))}
        </div>
        <button className="home-hero-btn">View Map 🗺️</button>
      </div>

      <div className="home-search">
        <span>🔍 Search destinations</span>
        <span className="home-search-filter">🎚️</span>
      </div>

      <div className="home-steps-card">
        <div>
          <div className="home-steps-label">Today's Steps</div>
          <div className="home-steps-value">
            {STEPS.current.toLocaleString()} <span>/ {STEPS.goal.toLocaleString()}</span>
          </div>
          <div className="home-steps-bar">
            <div className="home-steps-bar-fill" style={{ width: `${stepsPct}%` }} />
          </div>
        </div>
        <div className="home-steps-icon">🌿</div>
      </div>

      <div className="home-section-header">
        <span>Popular in Batam</span>
        <span className="home-see-all">See All</span>
      </div>

      <div className="home-popular">
        {POPULAR.map((place) => (
          <div className="home-popular-card" key={place.id}>
            <div className="home-popular-photo" />
            <div className="home-popular-name">{place.name}</div>
            <div className="home-popular-meta">
              📍 {place.distanceKm} km &nbsp;⭐ {place.points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
