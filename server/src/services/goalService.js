import Goal from '../models/Goal.js';
import ApiError from '../utils/ApiError.js';

const enhanceGoal = (goal) => {
  const obj = goal.toObject();
  
  // Remaining amount = max(targetAmount - currentAmount, 0)
  obj.remainingAmount = Math.max(obj.targetAmount - obj.currentAmount, 0);
  
  // Progress percentage = currentAmount / targetAmount * 100
  obj.progressPercentage = Math.min((obj.currentAmount / obj.targetAmount) * 100, 100);
  
  // Estimated required monthly savings
  if (obj.targetDate && obj.status === 'active' && obj.remainingAmount > 0) {
    const now = new Date();
    const target = new Date(obj.targetDate);
    const monthsRemaining = (target.getFullYear() - now.getFullYear()) * 12 + target.getMonth() - now.getMonth();
    
    if (monthsRemaining > 0) {
      obj.monthlyContributionTarget = obj.remainingAmount / monthsRemaining;
    } else {
      obj.monthlyContributionTarget = obj.remainingAmount; // Due this month or past due
    }
  } else {
    obj.monthlyContributionTarget = null;
  }
  
  return obj;
};

export const goalService = {
  createGoal: async (userId, data) => {
    const goal = new Goal({ ...data, userId });
    
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }
    
    await goal.save();
    return enhanceGoal(goal);
  },

  getGoals: async (userId) => {
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
    return goals.map(enhanceGoal);
  },

  getGoalById: async (userId, goalId) => {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) throw new ApiError(404, 'Goal not found');
    return enhanceGoal(goal);
  },

  updateGoal: async (userId, goalId, data) => {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) throw new ApiError(404, 'Goal not found');

    Object.assign(goal, data);

    if (goal.currentAmount >= goal.targetAmount && goal.status !== 'archived') {
      goal.status = 'completed';
    } else if (goal.currentAmount < goal.targetAmount && goal.status === 'completed') {
      goal.status = 'active';
    }

    await goal.save();
    return enhanceGoal(goal);
  },

  deleteGoal: async (userId, goalId) => {
    const goal = await Goal.findOneAndDelete({ _id: goalId, userId });
    if (!goal) throw new ApiError(404, 'Goal not found');
    return true;
  },

  contribute: async (userId, goalId, amount) => {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) throw new ApiError(404, 'Goal not found');

    // Calculate new amount
    const newAmount = goal.currentAmount + amount;
    if (newAmount < 0) {
      throw new ApiError(400, 'Withdrawal amount exceeds current saved amount');
    }

    goal.currentAmount = newAmount;

    if (goal.currentAmount >= goal.targetAmount && goal.status !== 'archived') {
      goal.status = 'completed';
    } else if (goal.currentAmount < goal.targetAmount && goal.status === 'completed') {
      goal.status = 'active';
    }

    await goal.save();
    return enhanceGoal(goal);
  },
};

export default goalService;
