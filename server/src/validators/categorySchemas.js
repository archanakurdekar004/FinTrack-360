import { z } from 'zod';

/**
 * Zod validation schema for Creating a Category.
 */
export const createCategorySchema = z.object({
  name: z
    .string({ required_error: 'Category name is required' })
    .trim()
    .min(1, 'Category name cannot be empty')
    .max(50, 'Category name cannot exceed 50 characters'),
  type: z.enum(['expense', 'income', 'both'], {
    required_error: 'Category type is required',
    invalid_type_error: 'Type must be expense, income, or both',
  }),
  icon: z.string().trim().optional(),
  color: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format (must be hex color e.g. #10b981)')
    .optional(),
  isActive: z.boolean().optional(),
});

/**
 * Zod validation schema for Updating a Category.
 */
export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name cannot be empty')
    .max(50, 'Category name cannot exceed 50 characters')
    .optional(),
  type: z.enum(['expense', 'income', 'both']).optional(),
  icon: z.string().trim().optional(),
  color: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format (must be hex color e.g. #10b981)')
    .optional(),
  isActive: z.boolean().optional(),
});
