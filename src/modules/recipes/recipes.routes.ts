import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate, optionalAuth } from '../../middleware/auth.js';
import { requirePro } from '../../middleware/premium.js';
import * as recipeController from './recipes.controller.js';
import {
  createRecipeSchema,
  updateRecipeSchema,
  recipeQuerySchema,
  generateCloneSchema,
} from './recipes.schema.js';

const router = Router();

// Public routes
router.get('/', validate(recipeQuerySchema, 'query'), recipeController.getRecipes);
router.get('/:slug', optionalAuth, recipeController.getRecipe);

// Protected routes
router.post('/', authenticate, validate(createRecipeSchema), recipeController.createRecipe);
router.patch('/:slug', authenticate, validate(updateRecipeSchema), recipeController.updateRecipe);
router.delete('/:slug', authenticate, recipeController.deleteRecipe);
router.post('/:slug/brewed', authenticate, recipeController.markBrewed);

// Clone generation (Pro+)
router.post(
  '/generate-clone',
  authenticate,
  validate(generateCloneSchema),
  recipeController.generateCloneRecipe,
);

export default router;
