import api from './api';

export const recurringTransactionService = {
  getSchedules: async (params) => {
    return await api.get('/recurring-transactions', { params });
  },

  getScheduleById: async (id) => {
    return await api.get(`/recurring-transactions/${id}`);
  },

  createSchedule: async (data) => {
    return await api.post('/recurring-transactions', data);
  },

  updateSchedule: async (id, data) => {
    return await api.put(`/recurring-transactions/${id}`, data);
  },

  deleteSchedule: async (id) => {
    return await api.delete(`/recurring-transactions/${id}`);
  },

  pauseSchedule: async (id) => {
    return await api.post(`/recurring-transactions/${id}/pause`);
  },

  resumeSchedule: async (id) => {
    return await api.post(`/recurring-transactions/${id}/resume`);
  },

  processDue: async () => {
    return await api.post('/recurring-transactions/process-due');
  }
};

export default recurringTransactionService;
