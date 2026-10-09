import ApiResponse from '../utils/ApiResponse.js';
import recurringTransactionService from '../services/recurringTransactionService.js';

export const createSchedule = async (req, res, next) => {
  try {
    const data = await recurringTransactionService.createSchedule(req.user.userId, req.body);
    return res.status(201).json(new ApiResponse(201, data, 'Schedule created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getSchedules = async (req, res, next) => {
  try {
    const data = await recurringTransactionService.getSchedules(req.user.userId, req.query);
    return res.status(200).json(new ApiResponse(200, data, 'Schedules retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getScheduleById = async (req, res, next) => {
  try {
    const data = await recurringTransactionService.getScheduleById(req.user.userId, req.params.id);
    return res.status(200).json(new ApiResponse(200, data, 'Schedule retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const data = await recurringTransactionService.updateSchedule(req.user.userId, req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, data, 'Schedule updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    await recurringTransactionService.deleteSchedule(req.user.userId, req.params.id);
    return res.status(200).json(new ApiResponse(200, null, 'Schedule deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const pauseSchedule = async (req, res, next) => {
  try {
    const data = await recurringTransactionService.pauseSchedule(req.user.userId, req.params.id);
    return res.status(200).json(new ApiResponse(200, data, 'Schedule paused'));
  } catch (error) {
    next(error);
  }
};

export const resumeSchedule = async (req, res, next) => {
  try {
    const data = await recurringTransactionService.resumeSchedule(req.user.userId, req.params.id);
    return res.status(200).json(new ApiResponse(200, data, 'Schedule resumed'));
  } catch (error) {
    next(error);
  }
};

export const processDue = async (req, res, next) => {
  try {
    const data = await recurringTransactionService.processDue(req.user.userId);
    return res.status(200).json(new ApiResponse(200, data, 'Due schedules processed'));
  } catch (error) {
    next(error);
  }
};
