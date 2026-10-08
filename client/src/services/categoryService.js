import api from './api';

export const categoryService = {
  /**
   * Fetch all categories for the authenticated user, optionally filtered by type or isActive.
   */
  getCategories: async (params = {}) => {
    return await api.get('/categories', { params });
  },

  /**
   * Create a new custom category.
   */
  createCategory: async (categoryData) => {
    return await api.post('/categories', categoryData);
  },

  /**
   * Update an existing category by ID.
   */
  updateCategory: async (id, updateData) => {
    return await api.put(`/categories/${id}`, updateData);
  },

  /**
   * Delete a category by ID (if unused).
   */
  deleteCategory: async (id) => {
    return await api.delete(`/categories/${id}`);
  },
};

export default categoryService;
