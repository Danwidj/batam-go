import { useState } from 'react';
import { STEPS, WEEKLY_STEPS, NEXT_REWARD, ECO_IMPACT, REWARDS, BADGES } from '../data/home-mock.js';

function formatMinutes(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatThousands(value) {
  return `${Math.round(value / 1000)}K`;
}

function StepsRing({ current, goal, pctLabel }) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div className="stats-ring" style={{ '--pct': pct }}>
      <div className="stats-ring-inner">
        <div className="stats-ring-value">{current.toLocaleString()}</div>
        <div className="stats-ring-sub">of {goal.toLocaleString()} steps</div>
        <div className="stats-ring-pct">{pct}%</div>
        <div className="stats-ring-pct-label">{pctLabel}</div>
      </div>
    </div>
  );
}

function ActivityView({ period, onPeriodChange }) {
  const source = period === 'daily' ? STEPS : WEEKLY_STEPS;
  const rewardPct = Math.min(100, Math.round((STEPS.current / STEPS.goal) * 100));
  const maxDayValue = Math.max(...WEEKLY_STEPS.days.map((d) => d.steps));

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
            <div>📍 {source.distanceKm} km</div>
            <span>Distance</span>
          </div>
          <div className="stats-ring-meta-item">
            <div>⏱️ {formatMinutes(source.activeMinutes)}</div>
            <span>Active</span>
          </div>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-card-header">
          <span>This Week</span>
          <span>
            {WEEKLY_STEPS.current.toLocaleString()} steps{' '}
            <span className="stats-positive">+{WEEKLY_STEPS.changePct}% ↑</span>
          </span>
        </div>
        <div className="stats-bars">
          {WEEKLY_STEPS.days.map((d, i) => (
            <div className="stats-bar-col" key={i}>
              <div className="stats-bar-track">
                <div
                  className={`stats-bar-fill ${d.isToday ? 'today' : ''}`}
                  style={{ height: `${(d.steps / maxDayValue) * 100}%` }}
                />
              </div>
              <span>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-card-label">Your Eco Impact</div>
        <div className="stats-eco-grid">
          <div className="stats-eco-item">
            <span>🌿</span>
            <strong>{ECO_IMPACT.co2SavedKg} kg</strong>
            <small>CO₂ Saved</small>
          </div>
          <div className="stats-eco-item">
            <span>🚗</span>
            <strong>{ECO_IMPACT.carTripsAvoided}</strong>
            <small>Car Trips Avoided</small>
          </div>
          <div className="stats-eco-item">
            <span>🌳</span>
            <strong>{ECO_IMPACT.treesEquivalent}</strong>
            <small>Trees Equivalent</small>
          </div>
        </div>
      </div>

      <div className="stats-reward-line">
        <div className="stats-reward-text">
          🎁 {NEXT_REWARD.stepsRemaining.toLocaleString()} steps to your next reward
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
        <div>
          <div className="stats-card-label">Total Steps</div>
          <div className="stats-total-value">{totalSteps.toLocaleString()}</div>
          <div className="stats-credit-pill">✓ {REWARDS.stepCredits} Step Credits</div>
        </div>
        <div className="stats-island-art" />
      </div>

      <div className="stats-card">
        <div className="stats-card-label">Next Big Goal</div>
        <StepsRing current={totalSteps} goal={goal} pctLabel="complete" />
        <div className="stats-goal-note">
          {stepsToGoal.toLocaleString()} steps to unlock {REWARDS.creditsAtNextGoal.toLocaleString()} credits
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-card-label">Milestone Rewards</div>
        <div className="stats-milestones">
          {REWARDS.milestones.map((m) => {
            const done = totalSteps >= m.threshold;
            return (
              <div className="stats-milestone" key={m.threshold}>
                <div className={`stats-milestone-dot ${done ? 'done' : ''}`}>{done ? '✓' : '🎁'}</div>
                <div className="stats-milestone-label">{formatThousands(m.threshold)}</div>
                <div className="stats-milestone-credits">{m.credits} credits</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-card-label">Your Badges</div>
        <div className="stats-badges-grid">
          {BADGES.map((b) => (
            <div className={`stats-badge ${b.earned ? 'earned' : 'locked'}`} key={b.id}>
              <div className="stats-badge-icon">{b.icon}</div>
              <div className="stats-badge-name">{b.name}</div>
              {!b.earned && <div className="stats-badge-locked">Locked</div>}
            </div>
          ))}
        </div>
        <div className="stats-badges-note">Complete challenges to earn more badges</div>
      </div>
    </>
  );
}

export default function Stats() {
  const [view, setView] = useState('activity');
  const [period, setPeriod] = useState('daily');

  return (
    <div className="stats-view">
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
