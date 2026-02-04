import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination.js';

export const createBeerSchema = z.object({
  name: z.string().min(1).max(200),
  breweryId: z.string().uuid(),
  style: z.string().min(1).max(100),
  substyle: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  abv: z.number().min(0).max(100).optional(),
  ibu: z.number().int().min(0).max(1000).optional(),
  srm: z.number().int().min(0).max(100).optional(),
  flavorTags: z.array(z.string()).default([]),
  foodPairings: z.array(z.string()).default([]),
  availability: z.string().max(100).optional(),
});

export const updateBeerSchema = createBeerSchema.partial();

export const beerQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  style: z.string().optional(),
  breweryId: z.string().uuid().optional(),
  minAbv: z.coerce.number().min(0).max(100).optional(),
  maxAbv: z.coerce.number().min(0).max(100).optional(),
  minIbu: z.coerce.number().int().min(0).optional(),
  maxIbu: z.coerce.number().int().max(1000).optional(),
  tier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND']).optional(),
  minIqScore: z.coerce.number().int().min(0).max(100).optional(),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

export type CreateBeerInput = z.infer<typeof createBeerSchema>;
export type UpdateBeerInput = z.infer<typeof updateBeerSchema>;
export type BeerQueryInput = z.infer<typeof beerQuerySchema>;
