import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as imagesService from './images.service.js';
import type { GenerateReviewImageInput, GenerateAvatarInput } from './images.schema.js';

export const generateReviewImage = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId }: GenerateReviewImageInput = req.body;
  const result = await imagesService.generateReviewImage(reviewId, req.user!.id);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const generateAvatar = asyncHandler(async (req: Request, res: Response) => {
  const { prompt }: GenerateAvatarInput = req.body;
  const result = await imagesService.generateAvatar(prompt);

  res.status(201).json({
    success: true,
    data: result,
  });
});
