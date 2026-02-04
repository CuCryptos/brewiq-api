import { prisma } from '../../config/database.js';
import { claudeService, BeerScanResult, MenuScanResult } from '../../services/claude.service.js';
import { uploadService } from '../../services/upload.service.js';
import { pointsService } from '../../services/points.service.js';
import { checkScanLimit } from '../../middleware/rateLimiter.js';
import { ApiError } from '../../utils/ApiError.js';
import { getSkip, paginate } from '../../utils/pagination.js';
import type { MembershipTier } from '@prisma/client';
import type { ScanBeerInput, ScanQueryInput } from './scans.schema.js';

export interface ScanResponse {
  scan: object;
  result: BeerScanResult | MenuScanResult;
  pointsAwarded: number;
  remaining: number;
}

export async function scanBeer(
  userId: string,
  tier: MembershipTier,
  input: ScanBeerInput,
): Promise<ScanResponse> {
  // Check scan limit
  const limit = await checkScanLimit(userId, tier);
  if (!limit.allowed) {
    throw ApiError.tooManyRequests(
      `Monthly scan limit reached. Resets ${limit.resetAt.toLocaleDateString()}. Upgrade for unlimited scans.`,
    );
  }

  // Upload image to Cloudinary
  const uploaded = await uploadService.uploadImage(input.image, 'brewiq/scans');

  // Scan with Claude
  const result = await claudeService.scanBeer(input.image, input.mediaType);

  // Try to find or create the beer in our database
  let beerId: string | null = null;

  if (result.identified && result.beer) {
    // Look for existing beer
    const existingBeer = await prisma.beer.findFirst({
      where: {
        name: { equals: result.beer.name, mode: 'insensitive' },
        brewery: {
          name: { equals: result.beer.brewery, mode: 'insensitive' },
        },
      },
    });

    if (existingBeer) {
      beerId = existingBeer.id;
    }
  }

  // Save scan record
  const scan = await prisma.scan.create({
    data: {
      userId,
      beerId,
      imageUrl: uploaded.url,
      scanType: 'single',
      confidence: result.confidence,
      rawResponse: result.rawResponse,
      iqScore: result.iqScore,
      tier: result.tier,
      tastingNotes: result.tastingNotes,
      flavorTags: result.flavorTags,
      foodPairings: result.foodPairings,
      tryNext: result.tryNext,
    },
    include: {
      beer: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  // Award points
  const points = await pointsService.awardPoints(userId, 'SCAN', scan.id);

  return {
    scan,
    result,
    pointsAwarded: points.points,
    remaining: limit.remaining,
  };
}

export async function scanMenu(
  userId: string,
  tier: MembershipTier,
  input: ScanBeerInput,
): Promise<ScanResponse> {
  // Check scan limit
  const limit = await checkScanLimit(userId, tier);
  if (!limit.allowed) {
    throw ApiError.tooManyRequests('Monthly scan limit reached');
  }

  // Upload image
  const uploaded = await uploadService.uploadImage(input.image, 'brewiq/menus');

  // Scan with Claude
  const result = await claudeService.scanMenu(input.image, input.mediaType);

  // Save scan record
  const scan = await prisma.scan.create({
    data: {
      userId,
      imageUrl: uploaded.url,
      scanType: 'menu',
      rawResponse: result.rawResponse,
    },
  });

  // Award points
  const points = await pointsService.awardPoints(userId, 'SCAN', scan.id);

  return {
    scan,
    result,
    pointsAwarded: points.points,
    remaining: limit.remaining,
  };
}

export async function scanShelf(
  userId: string,
  tier: MembershipTier,
  input: ScanBeerInput,
): Promise<ScanResponse> {
  // Check scan limit
  const limit = await checkScanLimit(userId, tier);
  if (!limit.allowed) {
    throw ApiError.tooManyRequests('Monthly scan limit reached');
  }

  // Upload image
  const uploaded = await uploadService.uploadImage(input.image, 'brewiq/shelves');

  // Scan with Claude
  const result = await claudeService.scanShelf(input.image, input.mediaType);

  // Save scan record
  const scan = await prisma.scan.create({
    data: {
      userId,
      imageUrl: uploaded.url,
      scanType: 'shelf',
      rawResponse: result.rawResponse,
    },
  });

  // Award points
  const points = await pointsService.awardPoints(userId, 'SCAN', scan.id);

  return {
    scan,
    result,
    pointsAwarded: points.points,
    remaining: limit.remaining,
  };
}

export async function getScanHistory(userId: string, query: ScanQueryInput) {
  const where: { userId: string; scanType?: string } = { userId };

  if (query.scanType) {
    where.scanType = query.scanType;
  }

  const [scans, total] = await Promise.all([
    prisma.scan.findMany({
      where,
      include: {
        beer: {
          select: { id: true, name: true, slug: true, imageUrl: true },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.scan.count({ where }),
  ]);

  return paginate(scans, total, query);
}

export async function getScanById(id: string, userId: string) {
  const scan = await prisma.scan.findUnique({
    where: { id },
    include: {
      beer: true,
    },
  });

  if (!scan) {
    throw ApiError.notFound('Scan not found');
  }

  if (scan.userId !== userId) {
    throw ApiError.forbidden('Access denied');
  }

  return scan;
}
