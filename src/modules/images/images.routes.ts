import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { tierRateLimiter } from '../../middleware/rateLimiter.js';
import * as imagesController from './images.controller.js';
import { generateReviewImageSchema, generateAvatarSchema } from './images.schema.js';

const router = Router();

// All image routes require authentication
router.use(authenticate);

// Tier-based rate limiting: 5/day free, 25/day pro, unlimited for unlimited
const imageRateLimit = tierRateLimiter('image_generation', {
  FREE: 5,
  PRO: 25,
  UNLIMITED: -1,
});

router.post(
  '/review',
  imageRateLimit,
  validate(generateReviewImageSchema),
  imagesController.generateReviewImage,
);

router.post(
  '/avatar',
  imageRateLimit,
  validate(generateAvatarSchema),
  imagesController.generateAvatar,
);

export default router;
