import { useState } from 'react';
import { USER, STEPS, POPULAR, HERO_IMAGE } from '../data/home-mock.js';

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
      <div className="home-all-popular-header shop-header-centered">
        <button className="shop-back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="shop-header-text">
          <div className="home-all-popular-title">Popular in Batam</div>
        </div>
        <div className="shop-header-spacer" />
      </div>

      <div className="home-all-popular-list">
        {POPULAR.map((place) => (
          <PopularCard place={place} key={place.id} />
        ))}
      </div>
    </div>
  );
}

export default function Home({ theme, onToggleTheme, onNavigate, onViewMap }) {
  const [screen, setScreen] = useState('home'); // 'home' | 'allPopular'
  const stepsPct = Math.min(100, Math.round((STEPS.current / STEPS.goal) * 100));

  if (screen === 'allPopular') {
    return <AllPopularScreen onBack={() => setScreen('home')} />;
  }

  return (
    <div className="home-view">
      <div className="home-header">
        <img className="home-avatar" src={USER.avatar} alt={USER.name} />
        <div className="home-greeting">Good morning, {USER.name}</div>
        <button
          className="home-theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="home-bell">
          🔔
          {USER.hasNotification && <span className="home-bell-dot" />}
        </div>
      </div>

      <div className="home-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="home-hero-title">Explore Batam</div>
        <div className="home-hero-art" />
        <button
          className="home-hero-btn"
          onClick={() => {
            if (onNavigate) onNavigate('map');
            else if (onViewMap) onViewMap();
          }}
        >
          View Map 🗺️
        </button>
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
