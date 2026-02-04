import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination.js';

export const scanBeerSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
  mediaType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp']).default('image/jpeg'),
});

export const scanQuerySchema = paginationSchema.extend({
  scanType: z.enum(['single', 'menu', 'shelf']).optional(),
});

export type ScanBeerInput = z.infer<typeof scanBeerSchema>;
export type ScanQueryInput = z.infer<typeof scanQuerySchema>;
