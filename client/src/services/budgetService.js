import api from './api';

export const budgetService = {
  getBudgets: async (month, year) => {
    return await api.get('/budgets', { params: { month, year } });
  },

  getBudgetById: async (id) => {
    return await api.get(`/budgets/${id}`);
  },

  createBudget: async (data) => {
    return await api.post('/budgets', data);
  },

  updateBudget: async (id, data) => {
    return await api.put(`/budgets/${id}`, data);
  },

  deleteBudget: async (id) => {
    return await api.delete(`/budgets/${id}`);
  },
};

export default budgetService;
