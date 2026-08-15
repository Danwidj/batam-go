import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  INITIAL_POINTS_BALANCE,
  POINTS_RATE_LABEL,
  VOUCHER_CATEGORIES,
  REWARD_TIERS,
  INITIAL_MY_VOUCHERS,
  FOOD_SPOTS
} from '../data/vouchers.js';
import {
  maxRedeemableQuantity,
  pointsRequired,
  balanceAfterRedemption,
  applyRedemption,
  consumeOneVoucher,
  categoryCounts
} from '../utils/rewards.js';

function categoryById(id) {
  return VOUCHER_CATEGORIES.find((c) => c.id === id);
}

function RedeemModal({ tier, pointsBalance, quantity, onQuantityChange, onClose, onConfirm }) {
  const maxQty = maxRedeemableQuantity(pointsBalance, tier.pointsCost);
  const required = pointsRequired(tier.pointsCost, quantity);
  const after = balanceAfterRedemption(pointsBalance, tier.pointsCost, quantity);
  const category = categoryById(tier.categoryId);

  return (
    <div className="shop-modal-backdrop">
      <div className="shop-modal">
        <button className="shop-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="shop-modal-title-row">
          <span className="shop-tier-icon">{category.icon}</span>
          <div>
            <div className="shop-modal-kicker">{category.label.toUpperCase()} VOUCHER</div>
            <div className="shop-modal-value">{tier.value}</div>
            <div className="shop-modal-subtext">{tier.pointsCost.toLocaleString()} points per voucher</div>
          </div>
        </div>

        <div className="shop-modal-balance-row">
          <div>
            <div className="shop-modal-label">CURRENT BALANCE</div>
            <div className="shop-modal-balance-value">{pointsBalance.toLocaleString()} pts</div>
          </div>
          <span className="shop-tier-icon">🌱</span>
        </div>

        <div className="shop-stepper-row">
          <div>
            <div className="shop-modal-label">Number of vouchers</div>
            <div className="shop-modal-subtext">Choose between 1 and {maxQty || 1} vouchers</div>
          </div>
          <div className="shop-stepper">
            <button
              className="shop-stepper-btn"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="shop-stepper-value">{quantity}</span>
            <button
              className="shop-stepper-btn"
              onClick={() => onQuantityChange(Math.min(maxQty, quantity + 1))}
              disabled={quantity >= maxQty}
            >
              +
            </button>
          </div>
        </div>

        <div className="shop-modal-summary">
          <div className="shop-modal-summary-row">
            <span>Voucher value</span>
            <span>
              {tier.value} × {quantity}
            </span>
          </div>
          <div className="shop-modal-summary-row">
            <span>Points required</span>
            <span>{required.toLocaleString()} pts</span>
          </div>
          <div className="shop-modal-summary-row shop-modal-summary-highlight">
            <span>Balance after redemption</span>
            <span>{after.toLocaleString()} pts</span>
          </div>
        </div>

        <button className="shop-primary-btn" onClick={onConfirm} disabled={maxQty === 0}>
          Redeem {quantity} voucher{quantity === 1 ? '' : 's'}
        </button>
        <p className="shop-modal-footnote">The digital voucher will appear in My Rewards.</p>
      </div>
    </div>
  );
}

function RewardsShopScreen({
  pointsBalance,
  activeCategory,
  onCategoryChange,
  myVoucherCount,
  onOpenMyVouchers,
  onRedeem
}) {
  const tiers = REWARD_TIERS.filter((t) => t.categoryId === activeCategory);
  const category = categoryById(activeCategory);

  return (
    <div className="shop-view">
      <div className="shop-header-row">
        <div>
          <h1>Rewards Shop</h1>
          <p className="shop-subtitle">Turn your points into Batam experiences</p>
        </div>
        <button className="shop-my-vouchers-btn" onClick={onOpenMyVouchers}>
          🎁 My Vouchers <span className="shop-badge">{myVoucherCount}</span>
        </button>
      </div>

      <div className="shop-points-card">
        <div>
          <div className="shop-points-label">YOUR POINTS</div>
          <div className="shop-points-value">
            {pointsBalance.toLocaleString()} <span>pts</span>
          </div>
          <div className="shop-points-rate">{POINTS_RATE_LABEL}</div>
        </div>
        <span className="shop-points-icon">🌱</span>
      </div>

      <div className="shop-section-header">Browse vouchers</div>
      <div className="shop-tabs">
        {VOUCHER_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`shop-tab ${cat.id === activeCategory ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="shop-section-header">
        <span>{category.label} vouchers</span>
      </div>

      {tiers.length === 0 && <p className="shop-empty">No vouchers in this category yet.</p>}

      <div className="shop-tier-grid">
        {tiers.map((tier) => {
          const locked = pointsBalance < tier.pointsCost;
          return (
            <div className="shop-tier-card" key={tier.id}>
              <span className="shop-tier-icon">{category.icon}</span>
              <div className="shop-tier-kicker">{category.label.toUpperCase()} VOUCHER</div>
              <div className="shop-tier-value">{tier.value}</div>
              <div className="shop-tier-points">{tier.pointsCost.toLocaleString()} pts</div>
              <div className="shop-tier-note">
                {locked
                  ? `${(tier.pointsCost - pointsBalance).toLocaleString()} more points needed`
                  : category.note}
              </div>
              <button
                className="shop-tier-btn"
                disabled={locked}
                onClick={() => onRedeem(tier)}
              >
                {locked ? 'Locked' : 'Redeem'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="shop-info-note">
        <p>Explore more places to earn points</p>
        <p className="shop-info-note-sub">Rewards are issued as digital vouchers.</p>
      </div>
    </div>
  );
}

function MyVouchersScreen({ myVouchers, earnedVouchers, onBack, onUse }) {
  const counts = categoryCounts(myVouchers, VOUCHER_CATEGORIES);
  const totalCount = myVouchers.reduce((sum, v) => sum + v.quantity, 0);

  return (
    <div className="shop-view">
      <div className="shop-header-row">
        <button className="shop-back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div>
          <h1>My Vouchers</h1>
          <p className="shop-subtitle">{totalCount} vouchers ready to use</p>
        </div>
      </div>

      <div className="shop-current-vouchers-card">
        <div className="shop-current-vouchers-label">CURRENT VOUCHERS</div>
        <div className="shop-current-vouchers-row">
          {VOUCHER_CATEGORIES.map((cat) => (
            <div className="shop-current-vouchers-col" key={cat.id}>
              <div className="shop-current-vouchers-count">{counts[cat.id] || 0}</div>
              <div className="shop-current-vouchers-cat">{cat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="shop-section-header">
        <span>Available vouchers</span>
        <span className="shop-see-all">Usage history</span>
      </div>

      {myVouchers.length === 0 && <p className="shop-empty">No vouchers yet — redeem points in the Rewards Shop.</p>}

      {myVouchers.map((voucher) => {
        const category = categoryById(voucher.categoryId);
        return (
          <div className="voucher-card" key={voucher.id}>
            <span className="shop-tier-icon">{category.icon}</span>
            <div className="voucher-info">
              <div className="shop-tier-kicker">{category.label.toUpperCase()} VOUCHER</div>
              <strong>{voucher.value}</strong>
              <p>
                {voucher.quantity} available · {voucher.expires}
              </p>
            </div>
            <button className="shop-tier-btn shop-use-btn" onClick={() => onUse(voucher)}>
              Use
            </button>
          </div>
        );
      })}

      {earnedVouchers.length > 0 && (
        <>
          <div className="shop-section-header">
            <span>Check-in rewards</span>
          </div>
          {earnedVouchers.map((voucher, i) => (
            <div className="voucher-card" key={`${voucher.business}-${i}`}>
              <div className="voucher-info">
                <strong>{voucher.business}</strong>
                <p>{voucher.offer}</p>
              </div>
              <QRCodeSVG value={voucher.code} size={72} />
            </div>
          ))}
        </>
      )}

      <div className="shop-info-note">
        <p>Tap Use when you are ready to redeem</p>
        <p className="shop-info-note-sub">The next screen will display your voucher.</p>
      </div>

      <button className="shop-text-link-btn" onClick={onBack}>
        Back to Rewards Shop
      </button>
    </div>
  );
}

function UseFoodVoucherScreen({ voucher, onBack, onSelectSpot }) {
  return (
    <div className="shop-view">
      <div className="shop-header-row">
        <button className="shop-back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div>
          <h1>Use Food Voucher</h1>
          <p className="shop-subtitle">Find a participating food spot nearby</p>
        </div>
      </div>

      <div className="shop-voucher-chip">
        <span className="shop-tier-icon">🔔</span>
        <div>
          <div className="shop-tier-kicker">FOOD VOUCHER</div>
          <strong>{voucher.value}</strong>
        </div>
      </div>

      <div className="shop-section-header">
        <span>Nearby spots</span>
      </div>

      {FOOD_SPOTS.map((spot) => (
        <div className="shop-spot-card" key={spot.id}>
          <span className="shop-tier-icon">🔔</span>
          <div className="voucher-info">
            <strong>{spot.name}</strong>
            <p>
              ⭐ {spot.rating} · {spot.distanceKm} km · Voucher accepted
            </p>
          </div>
          <button className="shop-tier-btn shop-use-btn" onClick={() => onSelectSpot(spot)}>
            View food spot
          </button>
        </div>
      ))}
    </div>
  );
}

function VoucherQRScreen({ label, code, onDone }) {
  return (
    <div className="shop-view">
      <div className="shop-header-row">
        <button className="shop-back" onClick={onDone} aria-label="Back">
          ←
        </button>
        <h1>Your Voucher</h1>
      </div>
      <div className="shop-qr-card">
        <p className="shop-qr-label">{label}</p>
        <QRCodeSVG value={code} size={180} />
        <p className="shop-qr-hint">Show this QR code to the cashier to redeem.</p>
      </div>
      <button className="shop-primary-btn" onClick={onDone}>
        Back to My Vouchers
      </button>
    </div>
  );
}

export default function Shop({ vouchers }) {
  const [screen, setScreen] = useState('shop'); // 'shop' | 'myVouchers' | 'useVoucher'
  const [activeCategory, setActiveCategory] = useState('food');
  const [pointsBalance, setPointsBalance] = useState(INITIAL_POINTS_BALANCE);
  const [myVouchers, setMyVouchers] = useState(INITIAL_MY_VOUCHERS);
  const [redeemTier, setRedeemTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [useVoucherId, setUseVoucherId] = useState(null);
  const [redeemedQR, setRedeemedQR] = useState(null);

  const myVoucherCount = myVouchers.reduce((sum, v) => sum + v.quantity, 0);
  const activeUseVoucher = myVouchers.find((v) => v.id === useVoucherId);

  function openRedeemModal(tier) {
    setRedeemTier(tier);
    setQuantity(1);
  }

  function confirmRedeem() {
    setPointsBalance((prev) => balanceAfterRedemption(prev, redeemTier.pointsCost, quantity));
    setMyVouchers((prev) => applyRedemption(prev, redeemTier, quantity));
    setRedeemTier(null);
  }

  function useVoucher(voucher) {
    if (voucher.categoryId === 'food') {
      setUseVoucherId(voucher.id);
      setScreen('useVoucher');
      return;
    }
    setMyVouchers((prev) => consumeOneVoucher(prev, voucher.id));
    setRedeemedQR({
      label: `${voucher.value} voucher`,
      code: `REWARD-${voucher.tierId}-DIRECT-${voucher.id}`
    });
  }

  function selectSpot(spot) {
    setMyVouchers((prev) => consumeOneVoucher(prev, activeUseVoucher.id));
    setRedeemedQR({
      label: `${activeUseVoucher.value} voucher — ${spot.name}`,
      code: `REWARD-${activeUseVoucher.tierId}-${spot.id}`
    });
  }

  function closeQR() {
    setRedeemedQR(null);
    setUseVoucherId(null);
    setScreen('myVouchers');
  }

  if (redeemedQR) {
    return <VoucherQRScreen label={redeemedQR.label} code={redeemedQR.code} onDone={closeQR} />;
  }

  if (screen === 'useVoucher' && activeUseVoucher) {
    return (
      <UseFoodVoucherScreen
        voucher={activeUseVoucher}
        onBack={() => setScreen('myVouchers')}
        onSelectSpot={selectSpot}
      />
    );
  }

  if (screen === 'myVouchers') {
    return (
      <MyVouchersScreen
        myVouchers={myVouchers}
        earnedVouchers={vouchers}
        onBack={() => setScreen('shop')}
        onUse={useVoucher}
      />
    );
  }

  return (
    <>
      <RewardsShopScreen
        pointsBalance={pointsBalance}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        myVoucherCount={myVoucherCount}
        onOpenMyVouchers={() => setScreen('myVouchers')}
        onRedeem={openRedeemModal}
      />
      {redeemTier && (
        <RedeemModal
          tier={redeemTier}
          pointsBalance={pointsBalance}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onClose={() => setRedeemTier(null)}
          onConfirm={confirmRedeem}
        />
      )}
    </>
  );
}
