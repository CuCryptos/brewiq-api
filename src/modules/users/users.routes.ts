import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate, optionalAuth } from '../../middleware/auth.js';
import * as userController from './users.controller.js';
import { updateUserSchema, userQuerySchema } from './users.schema.js';

const router = Router();

// Current user routes (authenticated)
router.patch('/me', authenticate, validate(updateUserSchema), userController.updateMe);
router.get('/me/stats', authenticate, userController.getMyStats);
router.get('/me/saved', authenticate, validate(userQuerySchema, 'query'), userController.getMySavedBeers);
router.get('/me/wishlist', authenticate, validate(userQuerySchema, 'query'), userController.getMyWishlist);

// Public user routes
router.get('/:username', optionalAuth, userController.getUser);
router.get('/:username/followers', validate(userQuerySchema, 'query'), userController.getFollowers);
router.get('/:username/following', validate(userQuerySchema, 'query'), userController.getFollowing);

// Follow/Unfollow (authenticated)
router.post('/:username/follow', authenticate, userController.followUser);
router.delete('/:username/follow', authenticate, userController.unfollowUser);

export default router;
