import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const monthYearQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(currentYear + 10).optional(),
});

export const monthlyQuerySchema = z.object({
  months: z.coerce.number().int().min(1).max(12).default(6),
});
