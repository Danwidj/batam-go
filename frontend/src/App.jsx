import { useState } from 'react';
import Home from './components/Home.jsx';
import MapView from './components/MapView.jsx';
import Shop from './components/Shop.jsx';
import Stats from './components/Stats.jsx';
import NavBar from './components/NavBar.jsx';
import { INITIAL_VOUCHERS } from './data/vouchers.js';

export default function App() {
  const [tab, setTab] = useState('home');
  const [vouchers, setVouchers] = useState(INITIAL_VOUCHERS);

  function handleVoucherEarned(voucher) {
    setVouchers((prev) => (prev.some((v) => v.code === voucher.code) ? prev : [...prev, voucher]));
  }

  return (
    <div className="app-shell">
      <div className="app-content">
        {tab === 'home' && <Home />}
        {tab === 'map' && <MapView onVoucherEarned={handleVoucherEarned} />}
        {tab === 'shop' && <Shop vouchers={vouchers} />}
        {tab === 'stats' && <Stats />}
      </div>
      <NavBar active={tab} onChange={setTab} />
    </div>
  );
}
