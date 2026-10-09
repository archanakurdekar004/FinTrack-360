import api from './api';

export const analyticsService = {
  getOverview: async (month, year) => {
    return await api.get('/analytics/overview', { params: { month, year } });
  },

  getMonthlyTrends: async (months = 6) => {
    return await api.get('/analytics/monthly', { params: { months } });
  },

  getCategoryBreakdown: async (month, year) => {
    return await api.get('/analytics/categories', { params: { month, year } });
  },

  getBudgetPerformance: async (month, year) => {
    return await api.get('/analytics/budget-performance', { params: { month, year } });
  },
};

export default analyticsService;
