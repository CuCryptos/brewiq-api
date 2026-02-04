import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate, optionalAuth } from '../../middleware/auth.js';
import * as reviewController from './reviews.controller.js';
import {
  createReviewSchema,
  updateReviewSchema,
  reviewQuerySchema,
  voteSchema,
  commentSchema,
} from './reviews.schema.js';

const router = Router();

// Public routes
router.get('/', validate(reviewQuerySchema, 'query'), reviewController.getReviews);
router.get('/:id', reviewController.getReview);
router.get('/:id/comments', validate(reviewQuerySchema, 'query'), reviewController.getComments);

// Protected routes
router.post('/', authenticate, validate(createReviewSchema), reviewController.createReview);
router.patch('/:id', authenticate, validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

// Voting
router.post('/:id/vote', authenticate, validate(voteSchema), reviewController.voteOnReview);
router.delete('/:id/vote', authenticate, reviewController.removeVote);

// Comments
router.post('/:id/comments', authenticate, validate(commentSchema), reviewController.addComment);

export default router;
