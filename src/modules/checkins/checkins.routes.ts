import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as checkinService from './checkins.service.js';
import { createCheckinSchema, checkinQuerySchema, CreateCheckinInput, CheckinQueryInput } from './checkins.schema.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createCheckinSchema), asyncHandler(async (req, res) => {
  const input: CreateCheckinInput = req.body;
  const checkin = await checkinService.createCheckin(req.user!.id, input);

  res.status(201).json({
    success: true,
    data: checkin,
  });
}));

router.get('/', validate(checkinQuerySchema, 'query'), asyncHandler(async (req, res) => {
  const query = req.query as unknown as CheckinQueryInput;
  const result = await checkinService.getCheckins(req.user!.id, query);

  res.json({
    success: true,
    ...result,
  });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await checkinService.deleteCheckin(req.params.id as string, req.user!.id);

  res.json({
    success: true,
    message: 'Check-in deleted',
  });
}));

export default router;
