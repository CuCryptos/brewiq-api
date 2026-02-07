import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination.js';

export const updateUserSchema = z.object({
  displayName: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().refine((url) => url.startsWith('https://res.cloudinary.com/'), 'Avatar must be uploaded via the app').optional(),
});

export const userQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
});

export const usernameParamSchema = z.object({
  username: z.string().min(1),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
