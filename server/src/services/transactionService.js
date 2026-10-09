import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';

export class TransactionService {
  /**
   * Helper to validate category existence, active status, and type compatibility.
   */
  static async validateCategoryCompatibility(userId, categoryId, transactionType) {
    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      throw ApiError.badRequest('Selected category does not exist or does not belong to your account.');
    }

    if (!category.isActive) {
      throw ApiError.badRequest(`Category "${category.name}" is inactive and cannot be used for new transactions.`);
    }

    // Check type compatibility
    const isExpenseCompatible = transactionType === 'expense' && (category.type === 'expense' || category.type === 'both');
    const isIncomeCompatible = transactionType === 'income' && (category.type === 'income' || category.type === 'both');

    if (!isExpenseCompatible && !isIncomeCompatible) {
      throw ApiError.badRequest(
        `Category "${category.name}" (type: ${category.type}) is incompatible with ${transactionType} transactions.`
      );
    }

    return category;
  }

  /**
   * Creates a new transaction.
   */
  static async createTransaction(userId, transactionData) {
    // Validate category ownership, active status, and type compatibility
    await this.validateCategoryCompatibility(userId, transactionData.categoryId, transactionData.type);

    const transaction = await Transaction.create({
      ...transactionData,
      userId,
    });

    return await transaction.populate('categoryId', 'name icon color type');
  }

  /**
   * Retrieves paginated transactions for the user with filtering and summary metrics.
   */
  static async getTransactions(userId, filters = {}) {
    const query = { userId: new mongoose.Types.ObjectId(userId) };

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.categoryId) {
      query.categoryId = new mongoose.Types.ObjectId(filters.categoryId);
    }

    if (filters.paymentMethod) {
      query.paymentMethod = filters.paymentMethod;
    }

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        // Set end of day if only date is passed
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    if (filters.search) {
      query.$or = [
        { description: { $regex: filters.search, $options: 'i' } },
        { notes: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Pagination calculations
    const page = Math.max(1, parseInt(filters.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(filters.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('categoryId', 'name icon color type');

    // Aggregate filtered totals (Income, Expenses, Net Balance)
    const summaryAgg = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    summaryAgg.forEach((item) => {
      if (item._id === 'income') totalIncome = item.totalAmount;
      if (item._id === 'expense') totalExpense = item.totalAmount;
    });

    const netBalance = totalIncome - totalExpense;

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
      },
    };
  }

  /**
   * Retrieves a single transaction by ID.
   */
  static async getTransactionById(userId, transactionId) {
    const transaction = await Transaction.findOne({ _id: transactionId, userId }).populate(
      'categoryId',
      'name icon color type'
    );

    if (!transaction) {
      throw ApiError.notFound('Transaction not found or access denied.');
    }

    return transaction;
  }

  /**
   * Updates an existing transaction.
   */
  static async updateTransaction(userId, transactionId, updateData) {
    const transaction = await Transaction.findOne({ _id: transactionId, userId });

    if (!transaction) {
      throw ApiError.notFound('Transaction not found or access denied.');
    }

    const targetCategoryId = updateData.categoryId || transaction.categoryId;
    const targetType = updateData.type || transaction.type;

    // Validate category compatibility if categoryId or type is changing
    if (updateData.categoryId || updateData.type) {
      await this.validateCategoryCompatibility(userId, targetCategoryId, targetType);
    }

    if (updateData.categoryId) transaction.categoryId = updateData.categoryId;
    if (updateData.type) transaction.type = updateData.type;
    if (updateData.amount !== undefined) transaction.amount = updateData.amount;
    if (updateData.date) transaction.date = updateData.date;
    if (updateData.description !== undefined) transaction.description = updateData.description;
    if (updateData.paymentMethod) transaction.paymentMethod = updateData.paymentMethod;
    if (updateData.notes !== undefined) transaction.notes = updateData.notes;

    await transaction.save();
    return await transaction.populate('categoryId', 'name icon color type');
  }

  /**
   * Deletes a transaction owned by the user.
   */
  static async deleteTransaction(userId, transactionId) {
    const transaction = await Transaction.findOne({ _id: transactionId, userId });

    if (!transaction) {
      throw ApiError.notFound('Transaction not found or access denied.');
    }

    await Transaction.deleteOne({ _id: transactionId, userId });
    return { id: transactionId, deleted: true };
  }
}

export default TransactionService;
