import { useEffect, useState } from 'react';
import Home from './components/Home.jsx';
import MapView from './components/MapView.jsx';
import Shop from './components/Shop.jsx';
import Stats from './components/Stats.jsx';
import NavBar from './components/NavBar.jsx';
import ConsentBanner from './components/ConsentBanner.jsx';
import { INITIAL_VOUCHERS } from './data/vouchers.js';
import { applyTheme, getInitialTheme } from './utils/theme.js';

export default function App() {
  const [tab, setTab] = useState('home');
  const [vouchers, setVouchers] = useState(INITIAL_VOUCHERS);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function handleVoucherEarned(voucher) {
    setVouchers((prev) => (prev.some((v) => v.code === voucher.code) ? prev : [...prev, voucher]));
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <div className="app-shell">
      <ConsentBanner />
      <div className="app-content">
        <div key={tab} className="tab-pane">
          {tab === 'home' && <Home theme={theme} onToggleTheme={toggleTheme} onNavigate={setTab} />}
          {tab === 'map' && <MapView onVoucherEarned={handleVoucherEarned} />}
          {tab === 'shop' && <Shop vouchers={vouchers} />}
          {tab === 'stats' && <Stats />}
        </div>
      </div>
      <NavBar active={tab} onChange={setTab} />
    </div>
  );
}
