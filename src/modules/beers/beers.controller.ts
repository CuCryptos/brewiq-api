import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as beerService from './beers.service.js';
import type { CreateBeerInput, UpdateBeerInput, BeerQueryInput } from './beers.schema.js';

export const createBeer = asyncHandler(async (req: Request, res: Response) => {
  const input: CreateBeerInput = req.body;
  const beer = await beerService.createBeer(input);

  res.status(201).json({
    success: true,
    data: beer,
  });
});

export const getBeers = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as BeerQueryInput;
  const result = await beerService.getBeers(query);

  res.json({
    success: true,
    ...result,
  });
});

export const getBeer = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const beer = await beerService.getBeerBySlug(slug);

  res.json({
    success: true,
    data: beer,
  });
});

export const updateBeer = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const input: UpdateBeerInput = req.body;
  const beer = await beerService.updateBeer(slug, input);

  res.json({
    success: true,
    data: beer,
  });
});

export const deleteBeer = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  await beerService.deleteBeer(slug);

  res.json({
    success: true,
    message: 'Beer deleted successfully',
  });
});

export const getTrendingBeers = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const beers = await beerService.getTrendingBeers(limit);

  res.json({
    success: true,
    data: beers,
  });
});

export const getBeerReviews = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const query = req.query as unknown as BeerQueryInput;
  const result = await beerService.getBeerReviews(slug, query);

  res.json({
    success: true,
    ...result,
  });
});

export const saveBeer = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const userId = req.user!.id;
  await beerService.saveBeer(userId, slug);

  res.json({
    success: true,
    message: 'Beer saved',
  });
});

export const unsaveBeer = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const userId = req.user!.id;
  await beerService.unsaveBeer(userId, slug);

  res.json({
    success: true,
    message: 'Beer unsaved',
  });
});

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const userId = req.user!.id;
  const { priority, notes } = req.body;
  await beerService.addToWishlist(userId, slug, priority, notes);

  res.json({
    success: true,
    message: 'Added to wishlist',
  });
});

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const userId = req.user!.id;
  await beerService.removeFromWishlist(userId, slug);

  res.json({
    success: true,
    message: 'Removed from wishlist',
  });
});
