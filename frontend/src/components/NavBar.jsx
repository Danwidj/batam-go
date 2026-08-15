const TABS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'map', label: 'Map', icon: '🗺️' },
  { id: 'shop', label: 'Shop', icon: '🛍️' },
  { id: 'stats', label: 'Stats', icon: '📊' }
];

export default function NavBar({ active, onChange, theme, onToggleTheme }) {
  return (
    <nav className="nav-bar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
      <button
        className="nav-theme-toggle"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>
    </nav>
  );
}
