import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as recipeService from './recipes.service.js';
import type {
  CreateRecipeInput,
  UpdateRecipeInput,
  RecipeQueryInput,
  GenerateCloneInput,
} from './recipes.schema.js';

export const createRecipe = asyncHandler(async (req: Request, res: Response) => {
  const input: CreateRecipeInput = req.body;
  const recipe = await recipeService.createRecipe(req.user!.id, input);

  res.status(201).json({
    success: true,
    data: recipe,
  });
});

export const getRecipes = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as RecipeQueryInput;
  const result = await recipeService.getRecipes(query);

  res.json({
    success: true,
    ...result,
  });
});

export const getRecipe = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const recipe = await recipeService.getRecipeBySlug(slug, req.user?.id);

  res.json({
    success: true,
    data: recipe,
  });
});

export const updateRecipe = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const input: UpdateRecipeInput = req.body;
  const recipe = await recipeService.updateRecipe(slug, req.user!.id, input);

  res.json({
    success: true,
    data: recipe,
  });
});

export const deleteRecipe = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  await recipeService.deleteRecipe(slug, req.user!.id);

  res.json({
    success: true,
    message: 'Recipe deleted',
  });
});

export const generateCloneRecipe = asyncHandler(async (req: Request, res: Response) => {
  const { beerId }: GenerateCloneInput = req.body;
  const recipe = await recipeService.generateCloneRecipe(
    req.user!.id,
    beerId,
    req.user!.membershipTier,
  );

  res.status(201).json({
    success: true,
    data: recipe,
  });
});

export const markBrewed = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  await recipeService.markBrewed(slug, req.user!.id);

  res.json({
    success: true,
    message: 'Brew count updated',
  });
});
