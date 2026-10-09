import RecurringTransaction from '../models/RecurringTransaction.js';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';

export const calculateNextDueDate = (currentDate, frequency) => {
  const d = new Date(currentDate);
  
  if (frequency === 'daily') {
    d.setUTCDate(d.getUTCDate() + 1);
  } else if (frequency === 'weekly') {
    d.setUTCDate(d.getUTCDate() + 7);
  } else if (frequency === 'monthly') {
    // Advance by 1 month, handle month-end safely
    const currentMonth = d.getUTCMonth();
    d.setUTCMonth(currentMonth + 1);
    // If the month rolled over too far (e.g., Jan 31 -> Feb 28/29 -> Mar 3 is WRONG, it should be Feb 28)
    if (d.getUTCMonth() !== (currentMonth + 1) % 12) {
      d.setUTCDate(0); // Roll back to last day of previous month
    }
  } else if (frequency === 'yearly') {
    const currentMonth = d.getUTCMonth();
    d.setUTCFullYear(d.getUTCFullYear() + 1);
    if (d.getUTCMonth() !== currentMonth) {
      d.setUTCDate(0);
    }
  }
  
  return d;
};

const validateCategory = async (userId, categoryId, type) => {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) throw new ApiError(404, 'Category not found or does not belong to you');
  if (!category.isActive) throw new ApiError(400, 'Cannot use an inactive category');
  if (category.type !== 'both' && category.type !== type) {
    throw new ApiError(400, `Category type '${category.type}' is incompatible with transaction type '${type}'`);
  }
};

export const recurringTransactionService = {
  createSchedule: async (userId, data) => {
    await validateCategory(userId, data.categoryId, data.type);
    
    // Convert to Date
    const startDate = new Date(data.startDate);
    let endDate = data.endDate ? new Date(data.endDate) : undefined;
    
    const schedule = new RecurringTransaction({
      ...data,
      userId,
      startDate,
      endDate,
      nextDueDate: startDate,
    });
    
    // Check if it's already completed by end date
    if (endDate && schedule.nextDueDate > endDate) {
      schedule.status = 'completed';
    }

    await schedule.save();
    return schedule;
  },

  getSchedules: async (userId, query = {}) => {
    const filter = { userId };
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [schedules, total] = await Promise.all([
      RecurringTransaction.find(filter)
        .populate('categoryId', 'name icon color type')
        .sort({ nextDueDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      RecurringTransaction.countDocuments(filter)
    ]);

    return {
      schedules,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  getScheduleById: async (userId, id) => {
    const schedule = await RecurringTransaction.findOne({ _id: id, userId }).populate('categoryId', 'name icon color type');
    if (!schedule) throw new ApiError(404, 'Schedule not found');
    return schedule;
  },

  updateSchedule: async (userId, id, data) => {
    const schedule = await RecurringTransaction.findOne({ _id: id, userId });
    if (!schedule) throw new ApiError(404, 'Schedule not found');

    if (data.categoryId || data.type) {
      const type = data.type || schedule.type;
      const categoryId = data.categoryId || schedule.categoryId;
      await validateCategory(userId, categoryId, type);
    }

    Object.assign(schedule, data);
    
    if (schedule.endDate && schedule.nextDueDate > new Date(schedule.endDate) && schedule.status !== 'completed') {
      schedule.status = 'completed';
    } else if (schedule.status === 'completed' && (!schedule.endDate || schedule.nextDueDate <= new Date(schedule.endDate))) {
      schedule.status = 'active';
    }

    await schedule.save();
    return schedule;
  },

  deleteSchedule: async (userId, id) => {
    const schedule = await RecurringTransaction.findOneAndDelete({ _id: id, userId });
    if (!schedule) throw new ApiError(404, 'Schedule not found');
    return true;
  },

  pauseSchedule: async (userId, id) => {
    const schedule = await RecurringTransaction.findOne({ _id: id, userId });
    if (!schedule) throw new ApiError(404, 'Schedule not found');
    if (schedule.status === 'completed') throw new ApiError(400, 'Cannot pause a completed schedule');
    
    schedule.status = 'paused';
    await schedule.save();
    return schedule;
  },

  resumeSchedule: async (userId, id) => {
    const schedule = await RecurringTransaction.findOne({ _id: id, userId });
    if (!schedule) throw new ApiError(404, 'Schedule not found');
    if (schedule.status === 'completed') throw new ApiError(400, 'Cannot resume a completed schedule');
    
    schedule.status = 'active';
    await schedule.save();
    return schedule;
  },

  processDue: async (userId) => {
    const now = new Date();
    
    // Find active schedules that are due
    const dueSchedules = await RecurringTransaction.find({
      userId,
      status: 'active',
      nextDueDate: { $lte: now }
    });

    let processedCount = 0;
    let skippedCount = 0;
    
    for (const schedule of dueSchedules) {
      // Loop to handle catch-up (multiple overdue occurrences)
      // Limit to 50 iterations per schedule to prevent unbounded loops
      let iterations = 0;
      let isCompleted = false;

      while (schedule.nextDueDate <= now && iterations < 50 && !isCompleted) {
        iterations++;
        const occurrenceDate = new Date(schedule.nextDueDate);

        try {
          // Attempt to create the transaction. The unique sparse index on (recurringTransactionId, date)
          // prevents duplicates at the database level!
          await Transaction.create({
            userId: schedule.userId,
            categoryId: schedule.categoryId,
            type: schedule.type,
            amount: schedule.amount,
            date: occurrenceDate,
            description: schedule.title,
            paymentMethod: schedule.paymentMethod,
            notes: schedule.notes || '',
            recurringTransactionId: schedule._id
          });
          processedCount++;
        } catch (err) {
          if (err.code === 11000) {
            // Duplicate key error: already generated this occurrence
            skippedCount++;
          } else {
            // Unhandled error: throw to fail this schedule and log it
            console.error('Error generating transaction for schedule', schedule._id, err);
            break; // Stop processing this schedule, do NOT advance nextDueDate
          }
        }

        // Successfully generated OR skipped duplicate. Safe to advance.
        const nextDate = calculateNextDueDate(occurrenceDate, schedule.frequency);
        schedule.nextDueDate = nextDate;
        schedule.lastGeneratedAt = now;

        // Check if completed
        if (schedule.endDate && schedule.nextDueDate > schedule.endDate) {
          schedule.status = 'completed';
          isCompleted = true;
        }
      }

      await schedule.save();
    }

    return { processedCount, skippedCount, schedulesProcessed: dueSchedules.length };
  }
};

export default recurringTransactionService;
