import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as reviewService from './reviews.service.js';
import type { CreateReviewInput, UpdateReviewInput, ReviewQueryInput, VoteInput, CommentInput } from './reviews.schema.js';

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const input: CreateReviewInput = req.body;
  const review = await reviewService.createReview(req.user!.id, input);

  res.status(201).json({
    success: true,
    data: review,
  });
});

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ReviewQueryInput;
  const result = await reviewService.getReviews(query);

  res.json({
    success: true,
    ...result,
  });
});

export const getReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const review = await reviewService.getReviewById(id);

  res.json({
    success: true,
    data: review,
  });
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input: UpdateReviewInput = req.body;
  const review = await reviewService.updateReview(id, req.user!.id, input);

  res.json({
    success: true,
    data: review,
  });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await reviewService.deleteReview(id, req.user!.id);

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

export const voteOnReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input: VoteInput = req.body;
  await reviewService.voteOnReview(id, req.user!.id, input);

  res.json({
    success: true,
    message: input.isHelpful ? 'Marked as helpful' : 'Marked as not helpful',
  });
});

export const removeVote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await reviewService.removeVote(id, req.user!.id);

  res.json({
    success: true,
    message: 'Vote removed',
  });
});

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = req.query as unknown as ReviewQueryInput;
  const result = await reviewService.getReviewComments(id, query);

  res.json({
    success: true,
    ...result,
  });
});

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input: CommentInput = req.body;
  const comment = await reviewService.addComment(id, req.user!.id, input);

  res.status(201).json({
    success: true,
    data: comment,
  });
});
