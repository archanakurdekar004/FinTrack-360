import ApiResponse from '../utils/ApiResponse.js';
import budgetService from '../services/budgetService.js';

export const getBudgets = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const month = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    const budgets = await budgetService.getBudgets(userId, month, year);

    return res.status(200).json(new ApiResponse(200, budgets, 'Budgets retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getBudgetById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const budget = await budgetService.getBudgetById(userId, req.params.id);

    return res.status(200).json(new ApiResponse(200, budget, 'Budget retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const createBudget = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const budget = await budgetService.createBudget(userId, req.body);

    return res.status(201).json(new ApiResponse(201, budget, 'Budget created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const budget = await budgetService.updateBudget(userId, req.params.id, req.body);

    return res.status(200).json(new ApiResponse(200, budget, 'Budget updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    await budgetService.deleteBudget(userId, req.params.id);

    return res.status(200).json(new ApiResponse(200, { deleted: true }, 'Budget deleted successfully'));
  } catch (error) {
    next(error);
  }
};
