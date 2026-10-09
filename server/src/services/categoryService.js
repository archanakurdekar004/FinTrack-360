import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import ApiError from '../utils/ApiError.js';

export const DEFAULT_CATEGORIES = [
  // Default Expense Categories
  { name: 'Food', type: 'expense', icon: '🍔', color: '#ef4444' },
  { name: 'Housing', type: 'expense', icon: '🏠', color: '#f59e0b' },
  { name: 'Utilities', type: 'expense', icon: '⚡', color: '#eab308' },
  { name: 'Transportation', type: 'expense', icon: '🚗', color: '#3b82f6' },
  { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#8b5cf6' },
  { name: 'Healthcare', type: 'expense', icon: '🏥', color: '#ec4899' },
  { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#6366f1' },
  { name: 'Education', type: 'expense', icon: '📚', color: '#14b8a6' },
  { name: 'Travel', type: 'expense', icon: '✈️', color: '#06b6d4' },
  { name: 'Personal Care', type: 'expense', icon: '💅', color: '#f43f5e' },
  { name: 'Other', type: 'expense', icon: '📦', color: '#64748b' },

  // Default Income Categories
  { name: 'Salary', type: 'income', icon: '💼', color: '#10b981' },
  { name: 'Freelance', type: 'income', icon: '💻', color: '#059669' },
  { name: 'Business', type: 'income', icon: '🏢', color: '#047857' },
  { name: 'Investment', type: 'income', icon: '📈', color: '#0f766e' },
  { name: 'Other Income', type: 'income', icon: '💵', color: '#15803d' },
];

export class CategoryService {
  /**
   * Seeds initial default categories for a newly registered user.
   */
  static async seedDefaultCategories(userId, options = {}) {
    const categoriesToCreate = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      userId,
      isDefault: true,
      isActive: true,
    }));

    return await Category.insertMany(categoriesToCreate, options);
  }

  /**
   * Retrieves all categories for the authenticated user with optional filtering.
   */
  static async getUserCategories(userId, filters = {}) {
    const query = { userId };

    if (filters.type && filters.type !== 'all') {
      query.type = { $in: [filters.type, 'both'] };
    }

    if (filters.isActive !== undefined && filters.isActive !== null && filters.isActive !== '') {
      query.isActive = filters.isActive === 'true' || filters.isActive === true;
    }

    return await Category.find(query).sort({ isDefault: -1, type: 1, name: 1 });
  }

  /**
   * Retrieves a single category by ID, strictly scoped to the user.
   */
  static async getCategoryById(userId, categoryId) {
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      throw ApiError.notFound('Category not found or access denied.');
    }
    return category;
  }

  /**
   * Creates a new custom category for the user.
   */
  static async createCategory(userId, categoryData) {
    const trimmedName = categoryData.name.trim();

    // Case-insensitive duplicate check for the same user
    const existing = await Category.findOne({
      userId,
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
    });

    if (existing) {
      throw ApiError.badRequest(`A category named "${trimmedName}" already exists in your account.`);
    }

    return await Category.create({
      userId,
      name: trimmedName,
      type: categoryData.type,
      icon: categoryData.icon || '📦',
      color: categoryData.color || '#10b981',
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      isDefault: false,
    });
  }

  /**
   * Updates an existing category owned by the user.
   */
  static async updateCategory(userId, categoryId, updateData) {
    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      throw ApiError.notFound('Category not found or access denied.');
    }

    // Check duplicate name if name is changing
    if (updateData.name) {
      const trimmedName = updateData.name.trim();
      const duplicate = await Category.findOne({
        userId,
        _id: { $ne: categoryId },
        name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
      });

      if (duplicate) {
        throw ApiError.badRequest(`A category named "${trimmedName}" already exists in your account.`);
      }

      category.name = trimmedName;
    }

    if (updateData.type) category.type = updateData.type;
    if (updateData.icon !== undefined) category.icon = updateData.icon;
    if (updateData.color !== undefined) category.color = updateData.color;
    if (updateData.isActive !== undefined) category.isActive = updateData.isActive;

    await category.save();
    return category;
  }

  /**
   * Deletes a category if no financial records reference it.
   */
  static async deleteCategory(userId, categoryId) {
    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      throw ApiError.notFound('Category not found or access denied.');
    }

    // Check for future financial references (Transaction, Budget, Recurring)
    const hasReferences = await this.checkCategoryReferences(categoryId);
    if (hasReferences) {
      throw ApiError.badRequest(
        'Cannot delete category because active transactions or budgets reference it. Please deactivate it instead.'
      );
    }

    await Category.deleteOne({ _id: categoryId, userId });
    return { id: categoryId, deleted: true };
  }

  /**
   * Helper method to verify if a category is referenced by any financial records.
   * Checks Transaction references (and extensible for future Budget / Recurring modules).
   */
  static async checkCategoryReferences(categoryId) {
    const txCount = await Transaction.countDocuments({ categoryId });
    return txCount > 0;
  }
}

export default CategoryService;
