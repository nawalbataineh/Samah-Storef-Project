/**
 * SAMAH STORE - Coupon API Service
 * Coupon/discount code endpoints
 */

import api from './api';

export const couponApi = {
  /**
   * Apply coupon code and calculate discount
   * POST /api/coupons/apply
   *
   * @param {string} code - Coupon code (required)
   * @param {number} subtotal - Order subtotal (required, min 0)
   * @returns {Promise<{code: string, type: 'PERCENT'|'FIXED', value: number, discount: number, finalTotal: number}>}
   */
  applyCoupon: async (code, subtotal) => {
    const response = await api.post('/api/coupons/apply', { code, subtotal });
    return response.data;
  },
};

