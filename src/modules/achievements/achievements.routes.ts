import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { paginationSchema } from '../../utils/pagination.js';
import * as achievementController from './achievements.controller.js';

const router = Router();

// Public - all available achievements
router.get('/', validate(paginationSchema, 'query'), achievementController.getAchievements);
router.get('/:id', achievementController.getAchievement);

// Authenticated - user's achievements
router.get('/me/progress', authenticate, validate(paginationSchema, 'query'), achievementController.getMyAchievements);

export default router;
