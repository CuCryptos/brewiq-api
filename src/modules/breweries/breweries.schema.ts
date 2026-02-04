import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination.js';

export const createBrewerySchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['MICROBREWERY', 'BREWPUB', 'REGIONAL', 'CRAFT', 'MAJOR', 'CONTRACT', 'TAPROOM']).default('CRAFT'),
  description: z.string().max(2000).optional(),
  websiteUrl: z.string().url().optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).default('USA'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  specialties: z.array(z.string()).default([]),
  hasTaproom: z.boolean().default(false),
  hasTours: z.boolean().default(false),
  hasFood: z.boolean().default(false),
  dogFriendly: z.boolean().default(false),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
});

export const updateBrewerySchema = createBrewerySchema.partial();

export const breweryQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  type: z.enum(['MICROBREWERY', 'BREWPUB', 'REGIONAL', 'CRAFT', 'MAJOR', 'CONTRACT', 'TAPROOM']).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  hasTaproom: z.coerce.boolean().optional(),
  hasTours: z.coerce.boolean().optional(),
  hasFood: z.coerce.boolean().optional(),
  dogFriendly: z.coerce.boolean().optional(),
  near: z.string().optional(), // "lat,lng" format
  radius: z.coerce.number().min(1).max(500).default(50), // miles
});

export type CreateBreweryInput = z.infer<typeof createBrewerySchema>;
export type UpdateBreweryInput = z.infer<typeof updateBrewerySchema>;
export type BreweryQueryInput = z.infer<typeof breweryQuerySchema>;
