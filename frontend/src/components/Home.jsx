import { useState } from 'react';
import { USER, STEPS, POPULAR, MAP_PINS, HERO_IMAGE } from '../data/home-mock.js';

function PopularCard({ place }) {
  return (
    <div className="home-popular-card">
      <div className="home-popular-photo" style={{ backgroundImage: `url(${place.image})` }} />
      <div className="home-popular-name">{place.name}</div>
      <div className="home-popular-meta">
        📍 {place.distanceKm} km &nbsp;⭐ {place.points} pts
      </div>
    </div>
  );
}

function AllPopularScreen({ onBack }) {
  return (
    <div className="home-view">
      <div className="home-all-popular-header">
        <button className="shop-back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="home-all-popular-title">Popular in Batam</div>
      </div>

      <div className="home-all-popular-list">
        {POPULAR.map((place) => (
          <PopularCard place={place} key={place.id} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState('home'); // 'home' | 'allPopular'
  const stepsPct = Math.min(100, Math.round((STEPS.current / STEPS.goal) * 100));

  if (screen === 'allPopular') {
    return <AllPopularScreen onBack={() => setScreen('home')} />;
  }

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

      <div className="home-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
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
        <button className="home-see-all" onClick={() => setScreen('allPopular')}>
          See All
        </button>
      </div>

      <div className="home-popular">
        {POPULAR.map((place) => (
          <PopularCard place={place} key={place.id} />
        ))}
      </div>
    </div>
  );
}
