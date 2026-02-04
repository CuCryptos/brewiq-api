import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination.js';

export const createListSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
});

export const updateListSchema = createListSchema.partial();

export const addToListSchema = z.object({
  beerId: z.string().uuid(),
  notes: z.string().max(500).optional(),
});

export const listQuerySchema = paginationSchema;

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type AddToListInput = z.infer<typeof addToListSchema>;
export type ListQueryInput = z.infer<typeof listQuerySchema>;
