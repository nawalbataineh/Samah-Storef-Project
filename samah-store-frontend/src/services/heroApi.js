import api from './api';

export const heroApi = {
  /**
   * Get public hero settings (no auth required)
   */
  getPublicHero: async () => {
    const { data } = await api.get('/api/public/hero');
    return data;
  },

  /**
   * Get admin hero settings (ADMIN role required)
   */
  getAdminHero: async () => {
    const { data } = await api.get('/api/admin/hero');
    return data;
  },

  /**
   * Update hero settings (ADMIN role required)
   */
  updateHero: async (payload) => {
    const { data } = await api.put('/api/admin/hero', payload);
    return data;
  },

  /**
   * Upload hero image (ADMIN role required)
   */
  uploadHeroImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/api/admin/hero/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

