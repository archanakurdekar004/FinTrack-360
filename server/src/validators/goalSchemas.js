import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

export const createGoalSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional(),
  targetAmount: z.number().positive('Target amount must be positive').min(0.01),
  currentAmount: z.number().nonnegative('Current amount cannot be negative').optional(),
  targetDate: z.preprocess((val) => (val === '' ? undefined : val), z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid target date' }).optional()),
});

export const updateGoalSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100).optional(),
  description: z.string().trim().max(500).optional(),
  targetAmount: z.number().positive('Target amount must be positive').min(0.01).optional(),
  targetDate: z.preprocess((val) => (val === '' ? undefined : val), z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid target date' }).optional()),
  status: z.enum(['active', 'completed', 'archived']).optional(),
});

export const contributeGoalSchema = z.object({
  amount: z.number({ required_error: 'Contribution amount is required' }),
});
