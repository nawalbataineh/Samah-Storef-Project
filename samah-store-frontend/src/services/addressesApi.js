import api from './api';

export const addressesApi = {
  getAddresses: async () => {
    const { data } = await api.get('/api/addresses');
    return data;
  },

  createAddress: async (addressData) => {
    const { data } = await api.post('/api/addresses', addressData);
    return data;
  },

  updateAddress: async (id, addressData) => {
    const { data } = await api.put(`/api/addresses/${id}`, addressData);
    return data;
  },

  deleteAddress: async (id) => {
    await api.delete(`/api/addresses/${id}`);
  },
};

