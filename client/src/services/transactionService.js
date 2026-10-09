import api from './api';

export const transactionService = {
  /**
   * Fetch paginated and filtered transactions.
   */
  getTransactions: async (params = {}) => {
    return await api.get('/transactions', { params });
  },

  /**
   * Fetch a single transaction by ID.
   */
  getTransactionById: async (id) => {
    return await api.get(`/transactions/${id}`);
  },

  /**
   * Create a new transaction.
   */
  createTransaction: async (data) => {
    return await api.post('/transactions', data);
  },

  /**
   * Update an existing transaction by ID.
   */
  updateTransaction: async (id, data) => {
    return await api.put(`/transactions/${id}`, data);
  },

  /**
   * Delete a transaction by ID.
   */
  deleteTransaction: async (id) => {
    return await api.delete(`/transactions/${id}`);
  },
};

export default transactionService;
