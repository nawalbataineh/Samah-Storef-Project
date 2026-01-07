import api from './api';

export const productsApi = {
  getCategories: async () => {
    const { data } = await api.get('/api/categories');
    return data;
  },

  getProducts: async (params = {}) => {
    const { data } = await api.get('/api/products', { params });
    return data;
  },

  getProductBySlug: async (slug) => {
    const { data } = await api.get(`/api/products/${slug}`);
    return data;
  },
};

