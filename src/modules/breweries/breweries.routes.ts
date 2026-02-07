import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import * as breweryController from './breweries.controller.js';
import {
  createBrewerySchema,
  updateBrewerySchema,
  breweryQuerySchema,
} from './breweries.schema.js';

const router = Router();

// Public routes
router.get('/', validate(breweryQuerySchema, 'query'), breweryController.getBreweries);
router.get('/:slug', breweryController.getBrewery);
router.get('/:slug/beers', validate(breweryQuerySchema, 'query'), breweryController.getBreweryBeers);

// Admin-only routes (create/update/delete breweries)
router.post('/', authenticate, requireAdmin, validate(createBrewerySchema), breweryController.createBrewery);
router.patch('/:slug', authenticate, requireAdmin, validate(updateBrewerySchema), breweryController.updateBrewery);
router.delete('/:slug', authenticate, requireAdmin, breweryController.deleteBrewery);

export default router;
