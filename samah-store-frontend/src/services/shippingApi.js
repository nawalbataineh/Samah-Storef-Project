/**
 * SAMAH STORE - Shipping API Service
 * Shipping quote endpoints (CUSTOMER role)
 */

import api from './api';

export const shippingApi = {
  /**
   * Get shipping quote for an address
   * GET /api/shipping/quote
   *
   * @param {number} addressId - Address ID (required)
   * @param {number} subtotal - Order subtotal (optional)
   * @returns {Promise<{fee: number, city: string, zone: string|null}>}
   */
  getShippingQuote: async (addressId, subtotal = null) => {
    const params = { addressId };
    if (subtotal !== null) {
      params.subtotal = subtotal;
    }
    const { data } = await api.get('/api/shipping/quote', { params });
    return data;
  },
};


