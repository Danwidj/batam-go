import { MAX_VOUCHERS_PER_REDEMPTION } from '../data/vouchers.js';

export function maxRedeemableQuantity(pointsBalance, pointsCost) {
  return Math.max(0, Math.min(MAX_VOUCHERS_PER_REDEMPTION, Math.floor(pointsBalance / pointsCost)));
}

export function pointsRequired(pointsCost, quantity) {
  return pointsCost * quantity;
}

export function balanceAfterRedemption(pointsBalance, pointsCost, quantity) {
  return pointsBalance - pointsRequired(pointsCost, quantity);
}

export function applyRedemption(myVouchers, tier, quantity) {
  const existing = myVouchers.find((v) => v.tierId === tier.id);
  if (existing) {
    return myVouchers.map((v) => (v.tierId === tier.id ? { ...v, quantity: v.quantity + quantity } : v));
  }
  return [
    ...myVouchers,
    {
      id: `mv-${tier.id}-${myVouchers.length}`,
      tierId: tier.id,
      categoryId: tier.categoryId,
      value: tier.value,
      pointsCost: tier.pointsCost,
      quantity,
      expires: 'Expires in 30 days'
    }
  ];
}

export function consumeOneVoucher(myVouchers, voucherId) {
  return myVouchers
    .map((v) => (v.id === voucherId ? { ...v, quantity: v.quantity - 1 } : v))
    .filter((v) => v.quantity > 0);
}

export function categoryCounts(myVouchers, categories) {
  return categories.reduce((acc, cat) => {
    acc[cat.id] = myVouchers.filter((v) => v.categoryId === cat.id).reduce((sum, v) => sum + v.quantity, 0);
    return acc;
  }, {});
}
