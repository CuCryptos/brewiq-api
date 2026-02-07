import { Router } from 'express';
import { validate, validateRequest } from '../../middleware/validate.js';
import { authenticate, optionalAuth, requireAdmin } from '../../middleware/auth.js';
import * as beerController from './beers.controller.js';
import {
  createBeerSchema,
  updateBeerSchema,
  beerQuerySchema,
  slugParamSchema,
} from './beers.schema.js';

const router = Router();

// Public routes
router.get('/', validate(beerQuerySchema, 'query'), beerController.getBeers);
router.get('/trending', beerController.getTrendingBeers);
router.get('/:slug', beerController.getBeer);
router.get('/:slug/reviews', validate(beerQuerySchema, 'query'), beerController.getBeerReviews);

// Admin-only routes (create/update/delete beers)
router.post('/', authenticate, requireAdmin, validate(createBeerSchema), beerController.createBeer);
router.patch('/:slug', authenticate, requireAdmin, validate(updateBeerSchema), beerController.updateBeer);
router.delete('/:slug', authenticate, requireAdmin, beerController.deleteBeer);

// Save/Wishlist
router.post('/:slug/save', authenticate, beerController.saveBeer);
router.delete('/:slug/save', authenticate, beerController.unsaveBeer);
router.post('/:slug/wishlist', authenticate, beerController.addToWishlist);
router.delete('/:slug/wishlist', authenticate, beerController.removeFromWishlist);

export default router;
