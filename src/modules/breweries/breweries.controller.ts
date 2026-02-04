import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as breweryService from './breweries.service.js';
import type { CreateBreweryInput, UpdateBreweryInput, BreweryQueryInput } from './breweries.schema.js';

export const createBrewery = asyncHandler(async (req: Request, res: Response) => {
  const input: CreateBreweryInput = req.body;
  const brewery = await breweryService.createBrewery(input);

  res.status(201).json({
    success: true,
    data: brewery,
  });
});

export const getBreweries = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as BreweryQueryInput;
  const result = await breweryService.getBreweries(query);

  res.json({
    success: true,
    ...result,
  });
});

export const getBrewery = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const brewery = await breweryService.getBreweryBySlug(slug);

  res.json({
    success: true,
    data: brewery,
  });
});

export const updateBrewery = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const input: UpdateBreweryInput = req.body;
  const brewery = await breweryService.updateBrewery(slug, input);

  res.json({
    success: true,
    data: brewery,
  });
});

export const deleteBrewery = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  await breweryService.deleteBrewery(slug);

  res.json({
    success: true,
    message: 'Brewery deleted successfully',
  });
});

export const getBreweryBeers = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const query = req.query as unknown as BreweryQueryInput;
  const result = await breweryService.getBreweryBeers(slug, query);

  res.json({
    success: true,
    ...result,
  });
});
