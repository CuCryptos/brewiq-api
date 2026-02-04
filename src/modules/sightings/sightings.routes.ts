import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate, optionalAuth } from '../../middleware/auth.js';
import * as sightingController from './sightings.controller.js';
import {
  createSightingSchema,
  sightingQuerySchema,
  confirmSightingSchema,
} from './sightings.schema.js';

const router = Router();

// Public routes
router.get('/', validate(sightingQuerySchema, 'query'), sightingController.getSightings);
router.get('/nearby', sightingController.getNearbySightings);
router.get('/:id', sightingController.getSighting);

// Protected routes
router.post('/', authenticate, validate(createSightingSchema), sightingController.createSighting);
router.post('/:id/confirm', authenticate, validate(confirmSightingSchema), sightingController.confirmSighting);

export default router;
