import Budget from '../models/Budget.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

export const budgetService = {
  getBudgets: async (userId, month, year) => {
    // Determine start and end dates for the month to query transactions
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          month: parseInt(month),
          year: parseInt(year)
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $lookup: {
          from: 'transactions',
          let: {
            budgetCategory: '$categoryId',
            budgetUser: '$userId'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$budgetUser'] },
                    { $eq: ['$categoryId', '$$budgetCategory'] },
                    { $eq: ['$type', 'expense'] },
                    { $gte: ['$date', startDate] },
                    { $lt: ['$date', endDate] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                totalSpent: { $sum: '$amount' }
              }
            }
          ],
          as: 'transactionsInfo'
        }
      }
    ];

    const budgets = await Budget.aggregate(pipeline);

    // Map to include calculated properties
    return budgets.map((b) => {
      const spentAmount = b.transactionsInfo.length > 0 ? b.transactionsInfo[0].totalSpent : 0;
      const budgetAmount = b.amount;
      const remainingAmount = budgetAmount - spentAmount;
      const usagePercentage = (spentAmount / budgetAmount) * 100;
      const isExceeded = remainingAmount < 0;

      return {
        _id: b._id,
        categoryId: b.categoryId,
        category: {
          _id: b.category._id,
          name: b.category.name,
          icon: b.category.icon,
          color: b.category.color,
          type: b.category.type,
          isActive: b.category.isActive
        },
        amount: budgetAmount,
        month: b.month,
        year: b.year,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
        spentAmount,
        remainingAmount,
        usagePercentage,
        isExceeded
      };
    });
  },

  getBudgetById: async (userId, id) => {
    const budget = await Budget.findOne({ _id: id, userId });
    if (!budget) {
      throw new ApiError(404, 'Budget not found');
    }
    
    // We can just reuse getBudgets logic to get the single one with calculations
    const budgets = await budgetService.getBudgets(userId, budget.month, budget.year);
    const found = budgets.find(b => b._id.toString() === id.toString());
    if(!found) {
       throw new ApiError(404, 'Budget not found');
    }
    return found;
  },

  validateCategoryForBudget: async (userId, categoryId) => {
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      throw new ApiError(404, 'Category not found or does not belong to user');
    }
    if (!category.isActive) {
      throw new ApiError(400, 'Cannot use an inactive category for budgeting');
    }
    if (category.type === 'income') {
      throw new ApiError(400, 'Cannot budget for an income-only category');
    }
  },

  createBudget: async (userId, budgetData) => {
    await budgetService.validateCategoryForBudget(userId, budgetData.categoryId);

    const existing = await Budget.findOne({
      userId,
      categoryId: budgetData.categoryId,
      month: budgetData.month,
      year: budgetData.year
    });

    if (existing) {
      throw new ApiError(409, 'A budget already exists for this category in the specified month and year');
    }

    const budget = await Budget.create({
      userId,
      ...budgetData
    });

    return budget;
  },

  updateBudget: async (userId, id, updateData) => {
    const budget = await Budget.findOne({ _id: id, userId });
    if (!budget) {
      throw new ApiError(404, 'Budget not found');
    }

    if (updateData.categoryId) {
      await budgetService.validateCategoryForBudget(userId, updateData.categoryId);
    }

    // Check for duplicates if changing category, month, or year
    const checkCat = updateData.categoryId || budget.categoryId;
    const checkMonth = updateData.month || budget.month;
    const checkYear = updateData.year || budget.year;

    if (updateData.categoryId || updateData.month || updateData.year) {
      const existing = await Budget.findOne({
        userId,
        categoryId: checkCat,
        month: checkMonth,
        year: checkYear,
        _id: { $ne: id }
      });
      if (existing) {
        throw new ApiError(409, 'A budget already exists for this category in the specified month and year');
      }
    }

    Object.assign(budget, updateData);
    await budget.save();
    return budget;
  },

  deleteBudget: async (userId, id) => {
    const budget = await Budget.findOneAndDelete({ _id: id, userId });
    if (!budget) {
      throw new ApiError(404, 'Budget not found');
    }
    return budget;
  }
};

export default budgetService;
