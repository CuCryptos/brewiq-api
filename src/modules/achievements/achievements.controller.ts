import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as achievementService from './achievements.service.js';
import type { PaginationParams } from '../../utils/pagination.js';

export const getAchievements = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as PaginationParams;
  const result = await achievementService.getAchievements(query);

  res.json({
    success: true,
    ...result,
  });
});

export const getMyAchievements = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as PaginationParams;
  const result = await achievementService.getUserAchievements(req.user!.id, query);

  res.json({
    success: true,
    ...result,
  });
});

export const getAchievement = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const achievement = await achievementService.getAchievementById(id);

  res.json({
    success: true,
    data: achievement,
  });
});
