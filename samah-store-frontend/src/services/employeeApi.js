import api from './api';

export const employeeApi = {
  // ==================== ORDERS ====================

  listOrders: (params = {}) => {
    return api.get('/api/employee/orders', { params });
  },

  getOrder: (orderId) => {
    return api.get(`/api/employee/orders/${orderId}`);
  },

  updateOrderStatus: (orderId, status) => {
    return api.patch(`/api/employee/orders/${orderId}/status`, { status });
  },

  // ==================== TASKS ====================

  listTasks: (params = {}) => {
    return api.get('/api/employee/tasks', { params });
  },

  getTask: (taskId) => {
    return api.get(`/api/employee/tasks/${taskId}`);
  },

  createTask: (data) => {
    return api.post('/api/employee/tasks', data);
  },

  updateTask: (taskId, data) => {
    return api.put(`/api/employee/tasks/${taskId}`, data);
  },

  deleteTask: (taskId) => {
    return api.delete(`/api/employee/tasks/${taskId}`);
  },
};

