import { Router } from 'express';
import { validate, validateRequest } from '../../middleware/validate.js';
import { authenticate, optionalAuth } from '../../middleware/auth.js';
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

// Protected routes
router.post('/', authenticate, validate(createBeerSchema), beerController.createBeer);
router.patch('/:slug', authenticate, validate(updateBeerSchema), beerController.updateBeer);
router.delete('/:slug', authenticate, beerController.deleteBeer);

// Save/Wishlist
router.post('/:slug/save', authenticate, beerController.saveBeer);
router.delete('/:slug/save', authenticate, beerController.unsaveBeer);
router.post('/:slug/wishlist', authenticate, beerController.addToWishlist);
router.delete('/:slug/wishlist', authenticate, beerController.removeFromWishlist);

export default router;
