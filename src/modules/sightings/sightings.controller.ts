import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as sightingService from './sightings.service.js';
import type { CreateSightingInput, SightingQueryInput, ConfirmSightingInput } from './sightings.schema.js';

export const createSighting = asyncHandler(async (req: Request, res: Response) => {
  const input: CreateSightingInput = req.body;
  const sighting = await sightingService.createSighting(req.user!.id, input);

  res.status(201).json({
    success: true,
    data: sighting,
  });
});

export const getSightings = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as SightingQueryInput;
  const result = await sightingService.getSightings(query);

  res.json({
    success: true,
    ...result,
  });
});

export const getNearbySightings = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng, radius, limit } = req.query;

  if (!lat || !lng) {
    res.status(400).json({
      success: false,
      error: 'lat and lng query parameters are required',
    });
    return;
  }

  const sightings = await sightingService.getNearbySightings(
    parseFloat(lat as string),
    parseFloat(lng as string),
    radius ? parseFloat(radius as string) : undefined,
    limit ? parseInt(limit as string) : undefined,
  );

  res.json({
    success: true,
    data: sightings,
  });
});

export const getSighting = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const sighting = await sightingService.getSightingById(id);

  res.json({
    success: true,
    data: sighting,
  });
});

export const confirmSighting = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input: ConfirmSightingInput = req.body;
  await sightingService.confirmSighting(id, req.user!.id, input);

  res.json({
    success: true,
    message: input.stillAvailable ? 'Sighting confirmed' : 'Reported as unavailable',
  });
});
