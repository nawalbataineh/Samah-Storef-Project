import api from './api';

export const ordersApi = {
  placeOrder: async (orderData) => {
    const { data } = await api.post('/api/orders', orderData);
    return data;
  },

  getMyOrders: async (params = {}) => {
    const { data } = await api.get('/api/orders/me', { params });
    return data;
  },

  getOrderById: async (id) => {
    const { data } = await api.get(`/api/orders/${id}`);
    return data;
  },
};

