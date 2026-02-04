import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate, optionalAuth } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as listService from './lists.service.js';
import {
  createListSchema,
  updateListSchema,
  addToListSchema,
  listQuerySchema,
  CreateListInput,
  UpdateListInput,
  AddToListInput,
  ListQueryInput,
} from './lists.schema.js';
import { prisma } from '../../config/database.js';

const router = Router();

// Get my lists
router.get('/me', authenticate, validate(listQuerySchema, 'query'), asyncHandler(async (req, res) => {
  const query = req.query as unknown as ListQueryInput;
  const result = await listService.getUserLists(req.user!.id, query);

  res.json({
    success: true,
    ...result,
  });
}));

// Create list
router.post('/', authenticate, validate(createListSchema), asyncHandler(async (req, res) => {
  const input: CreateListInput = req.body;
  const list = await listService.createList(req.user!.id, input);

  res.status(201).json({
    success: true,
    data: list,
  });
}));

// Get list by username and slug
router.get('/:username/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const username = req.params.username as string;
  const slug = req.params.slug as string;

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  const list = await listService.getListBySlug(user.id, slug, req.user?.id);

  res.json({
    success: true,
    data: list,
  });
}));

// Update list
router.patch('/:slug', authenticate, validate(updateListSchema), asyncHandler(async (req, res) => {
  const slug = req.params.slug as string;
  const input: UpdateListInput = req.body;
  const list = await listService.updateList(req.user!.id, slug, input);

  res.json({
    success: true,
    data: list,
  });
}));

// Delete list
router.delete('/:slug', authenticate, asyncHandler(async (req, res) => {
  const slug = req.params.slug as string;
  await listService.deleteList(req.user!.id, slug);

  res.json({
    success: true,
    message: 'List deleted',
  });
}));

// Add beer to list
router.post('/:slug/beers', authenticate, validate(addToListSchema), asyncHandler(async (req, res) => {
  const slug = req.params.slug as string;
  const input: AddToListInput = req.body;
  const item = await listService.addBeerToList(req.user!.id, slug, input);

  res.status(201).json({
    success: true,
    data: item,
  });
}));

// Remove beer from list
router.delete('/:slug/beers/:beerId', authenticate, asyncHandler(async (req, res) => {
  const slug = req.params.slug as string;
  const beerId = req.params.beerId as string;
  await listService.removeBeerFromList(req.user!.id, slug, beerId);

  res.json({
    success: true,
    message: 'Beer removed from list',
  });
}));

export default router;
