import { z } from 'zod';
import mongoose from 'mongoose';

// Custom validator for MongoDB ObjectId
const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

const currentYear = new Date().getFullYear();

export const createBudgetSchema = z.object({
  categoryId: objectIdSchema,
  amount: z.number().positive('Budget amount must be strictly positive').min(0.01),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(currentYear + 10),
});

export const updateBudgetSchema = z.object({
  amount: z.number().positive('Budget amount must be strictly positive').min(0.01).optional(),
  categoryId: objectIdSchema.optional(),
  month: z.number().int().min(1).max(12).optional(),
  year: z.number().int().min(2000).max(currentYear + 10).optional(),
});

export const getBudgetsSchema = z.object({
  month: z.string().regex(/^(1[0-2]|[1-9])$/, 'Invalid month').optional(),
  year: z.string().regex(/^\d{4}$/, 'Invalid year').optional(),
});
