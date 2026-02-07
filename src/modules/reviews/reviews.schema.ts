import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination.js';

export const createReviewSchema = z.object({
  beerId: z.string().uuid(),
  rating: z.number().min(0).max(5).multipleOf(0.5),
  content: z.string().max(5000).optional(),
  flavorTags: z.array(z.string()).default([]),
  aroma: z.number().min(0).max(5).optional(),
  appearance: z.number().min(0).max(5).optional(),
  taste: z.number().min(0).max(5).optional(),
  mouthfeel: z.number().min(0).max(5).optional(),
  overall: z.number().min(0).max(5).optional(),
  servingType: z.string().max(50).optional(),
});

export const updateReviewSchema = createReviewSchema.omit({ beerId: true }).partial();

export const reviewQuerySchema = paginationSchema.extend({
  beerId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxRating: z.coerce.number().min(0).max(5).optional(),
  isVerified: z.coerce.boolean().optional(),
  sortBy: z.enum(['rating', 'helpfulCount', 'createdAt', 'updatedAt']).optional(),
});

export const voteSchema = z.object({
  isHelpful: z.boolean(),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(1000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
