import api from './api';

export const goalService = {
  getGoals: async () => {
    return await api.get('/goals');
  },
  
  getGoalById: async (id) => {
    return await api.get(`/goals/${id}`);
  },

  createGoal: async (data) => {
    return await api.post('/goals', data);
  },

  updateGoal: async (id, data) => {
    return await api.put(`/goals/${id}`, data);
  },

  deleteGoal: async (id) => {
    return await api.delete(`/goals/${id}`);
  },

  contribute: async (id, amount) => {
    return await api.post(`/goals/${id}/contributions`, { amount });
  },
};

export default goalService;
