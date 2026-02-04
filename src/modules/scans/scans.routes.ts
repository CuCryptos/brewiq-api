import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import * as scanController from './scans.controller.js';
import { scanBeerSchema, scanQuerySchema } from './scans.schema.js';

const router = Router();

// All scan routes require authentication
router.use(authenticate);

// Scan endpoints
router.post('/', validate(scanBeerSchema), scanController.scanBeer);
router.post('/menu', validate(scanBeerSchema), scanController.scanMenu);
router.post('/shelf', validate(scanBeerSchema), scanController.scanShelf);

// History
router.get('/history', validate(scanQuerySchema, 'query'), scanController.getScanHistory);
router.get('/:id', scanController.getScan);

export default router;
