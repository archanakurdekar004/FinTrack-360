import api from './api';

/**
 * Authentication Service API Methods Stub.
 */
export const authService = {
  checkBackendHealth: async () => {
    return await api.get('/health');
  },

  // Auth Stubs for implementation in next task:
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
  },
};

export default authService;
