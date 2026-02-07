import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination.js';

const ingredientSchema = z.object({
  name: z.string(),
  amount: z.number(),
  unit: z.string(),
});

const hopSchema = ingredientSchema.extend({
  time: z.number().optional(),
  use: z.string().optional(),
});

export const createRecipeSchema = z.object({
  name: z.string().min(1).max(200),
  style: z.string().min(1).max(100),
  type: z.enum(['ORIGINAL', 'CLONE']).default('ORIGINAL'),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).default('INTERMEDIATE'),
  description: z.string().max(2000).optional(),
  clonedBeerId: z.string().uuid().optional(),
  batchSize: z.number().min(0.5).max(100).default(5),
  boilTime: z.number().int().min(0).max(180).default(60),
  estimatedOg: z.number().optional(),
  estimatedFg: z.number().optional(),
  estimatedAbv: z.number().optional(),
  estimatedIbu: z.number().int().optional(),
  estimatedSrm: z.number().int().optional(),
  grains: z.array(ingredientSchema).default([]),
  hops: z.array(hopSchema).default([]),
  yeast: z.array(ingredientSchema).default([]),
  adjuncts: z.array(ingredientSchema).default([]),
  mashTemp: z.number().optional(),
  mashTime: z.number().int().optional(),
  fermentTemp: z.number().optional(),
  fermentDays: z.number().int().optional(),
  notes: z.string().max(5000).optional(),
  isPublic: z.boolean().default(true),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export const recipeQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  style: z.string().optional(),
  type: z.enum(['ORIGINAL', 'CLONE']).optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  userId: z.string().uuid().optional(),
  sortBy: z.enum(['name', 'style', 'difficulty', 'viewCount', 'brewCount', 'createdAt', 'updatedAt']).optional(),
});

export const generateCloneSchema = z.object({
  beerId: z.string().uuid(),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
export type RecipeQueryInput = z.infer<typeof recipeQuerySchema>;
export type GenerateCloneInput = z.infer<typeof generateCloneSchema>;
