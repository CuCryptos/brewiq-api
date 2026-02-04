import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination.js';

export const createCheckinSchema = z.object({
  beerId: z.string().uuid(),
  rating: z.number().min(0).max(5).optional(),
  notes: z.string().max(500).optional(),
  locationName: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  image: z.string().optional(),
});

export const checkinQuerySchema = paginationSchema.extend({
  beerId: z.string().uuid().optional(),
});

export type CreateCheckinInput = z.infer<typeof createCheckinSchema>;
export type CheckinQueryInput = z.infer<typeof checkinQuerySchema>;
