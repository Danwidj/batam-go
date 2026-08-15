import { useState } from 'react';
import { USER, STEPS, WEEKLY_STEPS, NEXT_REWARD, ECO_IMPACT, REWARDS, BADGES } from '../data/home-mock.js';

const FULL_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatMinutes(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatThousands(value) {
  if (!value || value === 0) return '0';
  return `${Math.round(value / 1000)}K`;
}

function ProfileHeader() {
  return (
    <div className="stats-profile-header">
      <div className="stats-profile-info">
        <div className="stats-profile-avatar">
          {USER.avatar ? (
            <img src={USER.avatar} alt={USER.name} className="stats-profile-avatar-img" />
          ) : (
            USER.name ? USER.name.charAt(0) : 'J'
          )}
        </div>
        <div className="stats-profile-details">
          <div className="stats-profile-greeting">Hello, {USER.name || 'Explorer'} 👋</div>
          <div className="stats-profile-sub">
            <span className="stats-profile-badge">🔥 5 Day Streak</span>
            <span className="stats-profile-badge">Level 4 Eco</span>
          </div>
        </div>
      </div>
      <div className="stats-profile-bell">
        🔔
        {USER.hasNotification && <span className="stats-profile-bell-dot" />}
      </div>
    </div>
  );
}

function StepsRing({ current, goal, pctLabel }) {
  const pct = Math.min(100, Math.max(0, Math.round((current / goal) * 100)));
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="stats-ring">
      <svg className="stats-ring-svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="stats-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2e7d32" />
            <stop offset="100%" stopColor="#4caf50" />
          </linearGradient>
        </defs>
        <circle
          className="stats-ring-bg"
          cx="80"
          cy="80"
          r={radius}
          strokeWidth="12"
        />
        <circle
          className="stats-ring-progress"
          cx="80"
          cy="80"
          r={radius}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          stroke="url(#stats-ring-gradient)"
        />
      </svg>
      <div className="stats-ring-inner">
        <div className="stats-ring-value">{current.toLocaleString()}</div>
        <div className="stats-ring-sub">of {goal.toLocaleString()} steps</div>
        <div className="stats-ring-pct-pill">{pct}%</div>
        <div className="stats-ring-pct-label">{pctLabel}</div>
      </div>
    </div>
  );
}

function ActivityView({ period, onPeriodChange }) {
  const defaultTodayIndex = WEEKLY_STEPS.days.findIndex((d) => d.isToday);
  const [selectedDayIndex, setSelectedDayIndex] = useState(defaultTodayIndex >= 0 ? defaultTodayIndex : 3);

  const source = period === 'daily' ? STEPS : WEEKLY_STEPS;
  const rewardPct = Math.min(100, Math.round((STEPS.current / STEPS.goal) * 100));

  // Determine chart scale with consistent, equal 2K / 20% intervals
  const chartMaxScale = 10000;
  const gridTicks = [
    { label: '10K', topPct: 0 },
    { label: '8K', topPct: 20 },
    { label: '6K', topPct: 40 },
    { label: '4K', topPct: 60 },
    { label: '2K', topPct: 80 },
    { label: '0', topPct: 100 }
  ];

  const selectedDay = WEEKLY_STEPS.days[selectedDayIndex] || WEEKLY_STEPS.days[0];
  const selectedDayKm = (selectedDay.steps * 0.00075).toFixed(1);
  const selectedDayMins = Math.round(selectedDay.steps / 100);

  return (
    <>
      <div className="stats-toggle">
        <button
          className={`stats-toggle-btn ${period === 'daily' ? 'active' : ''}`}
          onClick={() => onPeriodChange('daily')}
        >
          Daily
        </button>
        <button
          className={`stats-toggle-btn ${period === 'weekly' ? 'active' : ''}`}
          onClick={() => onPeriodChange('weekly')}
        >
          Weekly
        </button>
      </div>

      <div className="stats-card">
        <div className="stats-card-label">{period === 'daily' ? "Today's Steps" : "This Week's Steps"}</div>
        <StepsRing
          current={source.current}
          goal={source.goal}
          pctLabel={period === 'daily' ? 'of daily goal' : 'of weekly goal'}
        />
        <div className="stats-ring-meta">
          <div className="stats-ring-meta-item">
            <span className="stats-meta-icon">📍</span>
            <div>
              <strong>{source.distanceKm} km</strong>
              <small>Distance</small>
            </div>
          </div>
          <div className="stats-ring-meta-item">
            <span className="stats-meta-icon">⏱️</span>
            <div>
              <strong>{formatMinutes(source.activeMinutes)}</strong>
              <small>Active</small>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-card-header">
          <span className="stats-card-header-title">This Week</span>
          <span className="stats-card-header-meta">
            <strong>{WEEKLY_STEPS.current.toLocaleString()}</strong> steps{' '}
            <span className="stats-positive">+{WEEKLY_STEPS.changePct}% ↑</span>
          </span>
        </div>

        {/* Selected Day Banner */}
        <div className="stats-day-banner">
          <div className="stats-day-banner-title">
            <span>{FULL_DAY_NAMES[selectedDayIndex]}</span>
            {selectedDay.isToday && <span className="stats-day-today-tag">Today</span>}
          </div>
          <div className="stats-day-banner-steps">
            <strong>{selectedDay.steps.toLocaleString()}</strong> steps
          </div>
          <div className="stats-day-banner-meta">
            <span>📍 ~{selectedDayKm} km</span>
            <span>⏱️ ~{selectedDayMins} mins</span>
          </div>
        </div>

        {/* Bar Chart Container with Evenly Spaced Y-Axis (10K, 8K, 6K, 4K, 2K, 0) */}
        <div className="stats-chart-wrapper">
          <div className="stats-y-axis">
            {gridTicks.map((tick) => (
              <span
                key={tick.label}
                className="stats-y-label"
                style={{ top: `${tick.topPct}%` }}
              >
                {tick.label}
              </span>
            ))}
          </div>

          <div className="stats-chart-body">
            <div className="stats-chart-grid-lines">
              {gridTicks.filter(t => t.topPct < 100).map((tick) => (
                <div
                  key={tick.label}
                  className="stats-grid-line-dash"
                  style={{ top: `${tick.topPct}%` }}
                />
              ))}
            </div>

            <div className="stats-bars">
              {WEEKLY_STEPS.days.map((d, i) => {
                const isSelected = i === selectedDayIndex;
                const fillPct = d.steps === 0 ? 0 : Math.min(100, Math.max(3, (d.steps / chartMaxScale) * 100));

                return (
                  <div
                    className={`stats-bar-col ${isSelected ? 'selected' : ''}`}
                    key={i}
                    onClick={() => setSelectedDayIndex(i)}
                    title={`${FULL_DAY_NAMES[i]}: ${d.steps.toLocaleString()} steps`}
                  >
                    <div className={`stats-bar-val ${isSelected ? 'selected' : ''}`}>
                      {formatThousands(d.steps)}
                    </div>
                    <div className="stats-bar-track-clean">
                      <div
                        className={`stats-bar-fill ${isSelected ? 'selected' : 'unselected'}`}
                        style={{ height: `${fillPct}%` }}
                      />
                    </div>
                    <span className={`stats-bar-day ${d.isToday ? 'is-today' : ''} ${isSelected ? 'selected' : ''}`}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="stats-chart-hint">Tap any day bar to view detailed steps</div>
      </div>

      <div className="stats-card">
        <div className="stats-card-label">Your Eco Impact</div>
        <div className="stats-eco-grid">
          <div className="stats-eco-item">
            <span className="stats-eco-icon">🌿</span>
            <strong>{ECO_IMPACT.co2SavedKg} kg</strong>
            <small>CO₂ Saved</small>
          </div>
          <div className="stats-eco-item">
            <span className="stats-eco-icon">🚗</span>
            <strong>{ECO_IMPACT.carTripsAvoided}</strong>
            <small>Car Trips Avoided</small>
          </div>
          <div className="stats-eco-item">
            <span className="stats-eco-icon">🌳</span>
            <strong>{ECO_IMPACT.treesEquivalent}</strong>
            <small>Trees Equivalent</small>
          </div>
        </div>
      </div>

      <div className="stats-reward-line">
        <div className="stats-reward-header">
          <span className="stats-reward-icon">🎁</span>
          <span className="stats-reward-text">
            <strong>{NEXT_REWARD.stepsRemaining.toLocaleString()}</strong> steps to your next reward
          </span>
        </div>
        <div className="stats-reward-bar">
          <div className="stats-reward-bar-fill" style={{ width: `${rewardPct}%` }} />
        </div>
      </div>
    </>
  );
}

function RewardsView() {
  const totalSteps = WEEKLY_STEPS.current;
  const goal = REWARDS.nextGoal;
  const stepsToGoal = Math.max(0, goal - totalSteps);

  return (
    <>
      <div className="stats-card stats-total-card">
        <div className="stats-total-content">
          <div className="stats-total-label">Total Steps Earned</div>
          <div className="stats-total-value">{totalSteps.toLocaleString()}</div>
          <div className="stats-credit-pill">
            <span className="stats-credit-check">✓</span> {REWARDS.stepCredits} Step Credits
          </div>
        </div>
        <div className="stats-island-art" />
      </div>

      <div className="stats-card">
        <div className="stats-card-label">Next Big Goal</div>
        <StepsRing current={totalSteps} goal={goal} pctLabel="complete" />
        <div className="stats-goal-note">
          <strong>{stepsToGoal.toLocaleString()}</strong> steps to unlock <strong>{REWARDS.creditsAtNextGoal.toLocaleString()}</strong> credits
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-card-label">Milestone Rewards</div>
        <div className="stats-milestones">
          {REWARDS.milestones.map((m, idx) => {
            const done = totalSteps >= m.threshold;
            return (
              <div className="stats-milestone" key={m.threshold}>
                <div className={`stats-milestone-dot ${done ? 'done' : ''}`}>
                  {done ? '✓' : '🎁'}
                </div>
                {idx < REWARDS.milestones.length - 1 && (
                  <div className={`stats-milestone-line ${done ? 'done' : ''}`} />
                )}
                <div className="stats-milestone-info">
                  <div className="stats-milestone-label">{formatThousands(m.threshold)} steps</div>
                  <div className="stats-milestone-credits">+{m.credits} credits</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-card-label">Your Badges</div>
        <div className="stats-badges-grid">
          {BADGES.map((b) => (
            <div className={`stats-badge-card ${b.earned ? 'earned' : 'locked'}`} key={b.id}>
              <div className="stats-badge-img-wrapper">
                <img className="stats-badge-img" src={b.image} alt={b.name} />
              </div>
              <div className="stats-badge-name">{b.name}</div>
              <div className="stats-badge-status">
                {b.earned ? (
                  b.id === '50k-club' ? <span className="stats-badge-unlocked">Unlocked</span> : null
                ) : (
                  <span className="stats-badge-locked">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="stats-badges-note-pill">
          <span className="stats-badges-sprout-icon">🌱</span>
          <span>Complete challenges to earn more badges</span>
        </div>
      </div>
    </>
  );
}

export default function Stats() {
  const [view, setView] = useState('activity');
  const [period, setPeriod] = useState('daily');

  return (
    <div className="stats-view">
      <ProfileHeader />

      <div className="stats-switch">
        <button
          className={`stats-switch-btn ${view === 'activity' ? 'active' : ''}`}
          onClick={() => setView('activity')}
        >
          Your Activity
        </button>
        <button
          className={`stats-switch-btn ${view === 'rewards' ? 'active' : ''}`}
          onClick={() => setView('rewards')}
        >
          Rewards & Badges
        </button>
      </div>

      {view === 'activity' ? (
        <ActivityView period={period} onPeriodChange={setPeriod} />
      ) : (
        <RewardsView />
      )}
    </div>
  );
}


