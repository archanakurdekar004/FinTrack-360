import ApiResponse from '../utils/ApiResponse.js';
import analyticsService from '../services/analyticsService.js';

export const getOverview = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const month = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    const data = await analyticsService.getOverview(userId, month, year);
    return res.status(200).json(new ApiResponse(200, data, 'Analytics overview retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMonthlyTrends = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const months = req.query.months ? parseInt(req.query.months) : 6;

    const data = await analyticsService.getMonthlyTrends(userId, months);
    return res.status(200).json(new ApiResponse(200, data, 'Monthly trends retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const month = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    const data = await analyticsService.getCategoryBreakdown(userId, month, year);
    return res.status(200).json(new ApiResponse(200, data, 'Category breakdown retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getBudgetPerformance = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const month = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    const data = await analyticsService.getBudgetPerformance(userId, month, year);
    return res.status(200).json(new ApiResponse(200, data, 'Budget performance retrieved successfully'));
  } catch (error) {
    next(error);
  }
};
