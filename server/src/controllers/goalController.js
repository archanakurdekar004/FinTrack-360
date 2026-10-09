import ApiResponse from '../utils/ApiResponse.js';
import goalService from '../services/goalService.js';

export const createGoal = async (req, res, next) => {
  try {
    const data = await goalService.createGoal(req.user.userId, req.body);
    return res.status(201).json(new ApiResponse(201, data, 'Goal created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getGoals = async (req, res, next) => {
  try {
    const data = await goalService.getGoals(req.user.userId);
    return res.status(200).json(new ApiResponse(200, data, 'Goals retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getGoalById = async (req, res, next) => {
  try {
    const data = await goalService.getGoalById(req.user.userId, req.params.id);
    return res.status(200).json(new ApiResponse(200, data, 'Goal retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const data = await goalService.updateGoal(req.user.userId, req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, data, 'Goal updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    await goalService.deleteGoal(req.user.userId, req.params.id);
    return res.status(200).json(new ApiResponse(200, null, 'Goal deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const contributeGoal = async (req, res, next) => {
  try {
    const data = await goalService.contribute(req.user.userId, req.params.id, req.body.amount);
    return res.status(200).json(new ApiResponse(200, data, 'Contribution applied successfully'));
  } catch (error) {
    next(error);
  }
};
