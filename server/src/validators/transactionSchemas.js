import { z } from 'zod';

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
], {
  errorMap: () => ({ message: 'Invalid payment method' }),
});

/**
 * Zod validation schema for Creating a Transaction.
 */
export const createTransactionSchema = z.object({
  categoryId: z
    .string({ required_error: 'Category ID is required' })
    .regex(objectIdRegex, 'Invalid Category ID format'),
  type: z.enum(['expense', 'income'], {
    required_error: 'Transaction type is required',
    invalid_type_error: 'Type must be expense or income',
  }),
  amount: z
    .number({ required_error: 'Amount is required', invalid_type_error: 'Amount must be a number' })
    .gt(0, 'Amount must be a positive number greater than 0'),
  date: z
    .string({ required_error: 'Transaction date is required' })
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid transaction date format' }),
  description: z.string().trim().max(250, 'Description cannot exceed 250 characters').optional(),
  paymentMethod: paymentMethodsEnum.default('cash'),
  notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional(),
});

/**
 * Zod validation schema for Updating a Transaction.
 */
export const updateTransactionSchema = z.object({
  categoryId: z.string().regex(objectIdRegex, 'Invalid Category ID format').optional(),
  type: z.enum(['expense', 'income']).optional(),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .gt(0, 'Amount must be a positive number greater than 0')
    .optional(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid transaction date format' })
    .optional(),
  description: z.string().trim().max(250, 'Description cannot exceed 250 characters').optional(),
  paymentMethod: paymentMethodsEnum.optional(),
  notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional(),
});

/**
 * Zod validation schema for Transaction Query Parameters.
 */
export const transactionQuerySchema = z.object({
  type: z.preprocess((val) => (val === '' ? undefined : val), z.enum(['expense', 'income']).optional()),
  categoryId: z.preprocess((val) => (val === '' ? undefined : val), z.string().regex(objectIdRegex, 'Invalid Category ID format').optional()),
  paymentMethod: z.preprocess((val) => (val === '' ? undefined : val), paymentMethodsEnum.optional()),
  startDate: z.preprocess((val) => (val === '' ? undefined : val), z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid start date format' })
    .optional()),
  endDate: z.preprocess((val) => (val === '' ? undefined : val), z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid end date format' })
    .optional()),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
