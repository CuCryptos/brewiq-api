import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as scanService from './scans.service.js';
import type { ScanBeerInput, ScanQueryInput } from './scans.schema.js';

export const scanBeer = asyncHandler(async (req: Request, res: Response) => {
  const input: ScanBeerInput = req.body;
  const result = await scanService.scanBeer(req.user!.id, req.user!.membershipTier, input);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const scanMenu = asyncHandler(async (req: Request, res: Response) => {
  const input: ScanBeerInput = req.body;
  const result = await scanService.scanMenu(req.user!.id, req.user!.membershipTier, input);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const scanShelf = asyncHandler(async (req: Request, res: Response) => {
  const input: ScanBeerInput = req.body;
  const result = await scanService.scanShelf(req.user!.id, req.user!.membershipTier, input);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const getScanHistory = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ScanQueryInput;
  const result = await scanService.getScanHistory(req.user!.id, query);

  res.json({
    success: true,
    ...result,
  });
});

export const getScan = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const scan = await scanService.getScanById(id, req.user!.id);

  res.json({
    success: true,
    data: scan,
  });
});
