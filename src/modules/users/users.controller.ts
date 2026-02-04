import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as userService from './users.service.js';
import type { UpdateUserInput, UserQueryInput } from './users.schema.js';

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const username = req.params.username as string;
  const currentUserId = req.user?.id;
  const user = await userService.getUserByUsername(username, currentUserId);

  res.json({
    success: true,
    data: user,
  });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const input: UpdateUserInput = req.body;
  const user = await userService.updateUser(req.user!.id, input);

  res.json({
    success: true,
    data: user,
  });
});

export const getMyStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await userService.getUserStats(req.user!.id);

  res.json({
    success: true,
    data: stats,
  });
});

export const followUser = asyncHandler(async (req: Request, res: Response) => {
  const username = req.params.username as string;
  await userService.followUser(req.user!.id, username);

  res.json({
    success: true,
    message: 'Now following user',
  });
});

export const unfollowUser = asyncHandler(async (req: Request, res: Response) => {
  const username = req.params.username as string;
  await userService.unfollowUser(req.user!.id, username);

  res.json({
    success: true,
    message: 'Unfollowed user',
  });
});

export const getFollowers = asyncHandler(async (req: Request, res: Response) => {
  const username = req.params.username as string;
  const query = req.query as unknown as UserQueryInput;
  const result = await userService.getFollowers(username, query);

  res.json({
    success: true,
    ...result,
  });
});

export const getFollowing = asyncHandler(async (req: Request, res: Response) => {
  const username = req.params.username as string;
  const query = req.query as unknown as UserQueryInput;
  const result = await userService.getFollowing(username, query);

  res.json({
    success: true,
    ...result,
  });
});

export const getMySavedBeers = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as UserQueryInput;
  const result = await userService.getSavedBeers(req.user!.id, query);

  res.json({
    success: true,
    ...result,
  });
});

export const getMyWishlist = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as UserQueryInput;
  const result = await userService.getWishlist(req.user!.id, query);

  res.json({
    success: true,
    ...result,
  });
});
