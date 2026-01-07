import api from './api';

export const cartApi = {
  getCart: async () => {
    const { data } = await api.get('/api/cart');
    return data;
  },

  addItem: async (variantId, quantity) => {
    const { data } = await api.post('/api/cart/items', { variantId, quantity });
    return data;
  },

  updateQuantity: async (variantId, quantity) => {
    const { data } = await api.put(`/api/cart/items/${variantId}`, { quantity });
    return data;
  },

  removeItem: async (variantId) => {
    const { data } = await api.delete(`/api/cart/items/${variantId}`);
    return data;
  },

  clearCart: async () => {
    const { data } = await api.delete('/api/cart/clear');
    return data;
  },
};

