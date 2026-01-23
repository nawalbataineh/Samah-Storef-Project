import api from './api';

export const authApi = {
  register: async (username, email, password, phone) => {
    const payload = { username, email, password };
    if (phone !== undefined) payload.phone = phone;
    const { data } = await api.post('/api/auth/register', payload);
    return data;
  },

  login: async (usernameOrEmail, password) => {
    const { data } = await api.post('/api/auth/login', { usernameOrEmail, password });
    return data;
  },

  logout: async () => {
    await api.post('/api/auth/logout');
    localStorage.removeItem('token');
  },

  refresh: async () => {
    const { data } = await api.post('/api/auth/refresh');
    return data;
  },
};
