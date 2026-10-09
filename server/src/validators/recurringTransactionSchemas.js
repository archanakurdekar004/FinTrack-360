import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const paymentMethodsEnum = z.enum([
  'cash',
  'debit_card',
  'credit_card',
  'upi',
  'bank_transfer',
  'net_banking',
  'wallet',
  'other',
]);

const baseRecurringSchema = {
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  type: z.enum(['expense', 'income'], {
    required_error: 'Transaction type is required',
    invalid_type_error: 'Type must be expense or income',
  }),
  amount: z.number().positive('Amount must be positive').min(0.01),
  categoryId: z.string().regex(objectIdRegex, 'Invalid Category ID format'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly'], { required_error: 'Frequency is required' }),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid start date format' }),
  endDate: z.preprocess((val) => (val === '' ? undefined : val), z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid end date format' }).optional()),
  paymentMethod: paymentMethodsEnum.default('bank_transfer'),
  notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional(),
};

export const createRecurringTransactionSchema = z.object(baseRecurringSchema).refine(
  (data) => {
    if (data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'End date cannot be earlier than start date',
    path: ['endDate'],
  }
);

export const updateRecurringTransactionSchema = z.object({
  ...baseRecurringSchema,
  title: baseRecurringSchema.title.optional(),
  type: baseRecurringSchema.type.optional(),
  amount: baseRecurringSchema.amount.optional(),
  categoryId: baseRecurringSchema.categoryId.optional(),
  frequency: baseRecurringSchema.frequency.optional(),
  startDate: baseRecurringSchema.startDate.optional(),
  status: z.enum(['active', 'paused', 'completed']).optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'End date cannot be earlier than start date',
    path: ['endDate'],
  }
);
