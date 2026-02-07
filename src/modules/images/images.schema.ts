import { z } from 'zod';

export const generateReviewImageSchema = z.object({
  reviewId: z.string().uuid(),
});

export const generateAvatarSchema = z.object({
  prompt: z.string().min(3).max(500),
});

export type GenerateReviewImageInput = z.infer<typeof generateReviewImageSchema>;
export type GenerateAvatarInput = z.infer<typeof generateAvatarSchema>;
