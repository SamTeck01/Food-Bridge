/**
 * Six-character code the buyer shows at pickup. Derived from the order ID so
 * buyer and vendor see the same value without storing anything extra.
 */
export const pickupCode = (orderId: string): string =>
  orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase().padStart(6, '0');
