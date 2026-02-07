import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination.js';

export const createSightingSchema = z.object({
  beerId: z.string().uuid(),
  locationName: z.string().min(1).max(200),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  price: z.number().min(0).optional(),
  format: z.enum(['DRAFT', 'CAN', 'BOTTLE', 'GROWLER', 'CROWLER']).default('DRAFT'),
  freshness: z.enum(['FRESH', 'RECENT', 'AGED', 'UNKNOWN']).default('UNKNOWN'),
  notes: z.string().max(1000).optional(),
  image: z.string().optional(), // Base64 image
});

export const sightingQuerySchema = paginationSchema.extend({
  beerId: z.string().uuid().optional(),
  near: z.string().optional(), // "lat,lng" format
  radius: z.coerce.number().min(1).max(500).default(25), // miles
  city: z.string().optional(),
  state: z.string().optional(),
  format: z.enum(['DRAFT', 'CAN', 'BOTTLE', 'GROWLER', 'CROWLER']).optional(),
  verified: z.coerce.boolean().optional(),
});

export const nearbySightingsSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(0.1).max(500).default(25),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const confirmSightingSchema = z.object({
  stillAvailable: z.boolean().default(true),
});

export type CreateSightingInput = z.infer<typeof createSightingSchema>;
export type SightingQueryInput = z.infer<typeof sightingQuerySchema>;
export type NearbySightingsInput = z.infer<typeof nearbySightingsSchema>;
export type ConfirmSightingInput = z.infer<typeof confirmSightingSchema>;
