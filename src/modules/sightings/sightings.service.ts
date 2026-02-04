import { prisma } from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { getSkip, paginate, PaginatedResult } from '../../utils/pagination.js';
import { pointsService } from '../../services/points.service.js';
import { uploadService } from '../../services/upload.service.js';
import { notifyBeerSighting } from '../../websocket/index.js';
import type { CreateSightingInput, SightingQueryInput, ConfirmSightingInput } from './sightings.schema.js';
import type { Sighting, Prisma } from '@prisma/client';

type SightingWithRelations = Sighting & {
  user: { id: string; username: string; displayName: string | null; avatarUrl: string | null };
  beer: { id: string; name: string; slug: string; imageUrl: string | null };
  _count: { confirmations: number };
};

export async function createSighting(
  userId: string,
  input: CreateSightingInput,
): Promise<SightingWithRelations> {
  // Verify beer exists
  const beer = await prisma.beer.findUnique({
    where: { id: input.beerId },
    include: {
      brewery: { select: { name: true } },
    },
  });
  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  // Upload image if provided
  let imageUrl: string | undefined;
  if (input.image) {
    const uploaded = await uploadService.uploadImage(input.image, 'brewiq/sightings');
    imageUrl = uploaded.url;
  }

  // Calculate expiry (sightings are valid for 7 days by default)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const sighting = await prisma.sighting.create({
    data: {
      userId,
      beerId: input.beerId,
      locationName: input.locationName,
      address: input.address,
      city: input.city,
      state: input.state,
      latitude: input.latitude,
      longitude: input.longitude,
      price: input.price,
      format: input.format,
      freshness: input.freshness,
      notes: input.notes,
      imageUrl,
      expiresAt,
    },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      beer: {
        select: { id: true, name: true, slug: true, imageUrl: true },
      },
      _count: {
        select: { confirmations: true },
      },
    },
  });

  // Award points
  await pointsService.awardPoints(userId, 'SIGHTING', sighting.id);

  // Notify users who have alerts for this beer
  await notifyBeerAlerts(input.beerId, sighting);

  // Emit WebSocket event
  notifyBeerSighting(sighting);

  return sighting;
}

export async function getSightings(query: SightingQueryInput): Promise<PaginatedResult<SightingWithRelations>> {
  const where: Prisma.SightingWhereInput = {
    expiresAt: { gt: new Date() }, // Only show non-expired sightings
  };

  if (query.beerId) {
    where.beerId = query.beerId;
  }

  if (query.city) {
    where.city = { equals: query.city, mode: 'insensitive' };
  }

  if (query.state) {
    where.state = { equals: query.state, mode: 'insensitive' };
  }

  if (query.format) {
    where.format = query.format;
  }

  if (query.verified !== undefined) {
    where.isVerified = query.verified;
  }

  // Geolocation search
  if (query.near) {
    const [lat, lng] = query.near.split(',').map(parseFloat);
    if (!isNaN(lat) && !isNaN(lng)) {
      const latDelta = query.radius / 69;
      const lngDelta = query.radius / (69 * Math.cos(lat * Math.PI / 180));

      where.latitude = { gte: lat - latDelta, lte: lat + latDelta };
      where.longitude = { gte: lng - lngDelta, lte: lng + lngDelta };
    }
  }

  const [sightings, total] = await Promise.all([
    prisma.sighting.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        beer: {
          select: { id: true, name: true, slug: true, imageUrl: true },
        },
        _count: {
          select: { confirmations: true },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.sighting.count({ where }),
  ]);

  return paginate(sightings, total, query);
}

export async function getNearbySightings(
  latitude: number,
  longitude: number,
  radiusMiles: number = 25,
  limit: number = 20,
): Promise<SightingWithRelations[]> {
  const latDelta = radiusMiles / 69;
  const lngDelta = radiusMiles / (69 * Math.cos(latitude * Math.PI / 180));

  return prisma.sighting.findMany({
    where: {
      latitude: { gte: latitude - latDelta, lte: latitude + latDelta },
      longitude: { gte: longitude - lngDelta, lte: longitude + lngDelta },
      expiresAt: { gt: new Date() },
    },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      beer: {
        select: { id: true, name: true, slug: true, imageUrl: true },
      },
      _count: {
        select: { confirmations: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function confirmSighting(
  sightingId: string,
  userId: string,
  input: ConfirmSightingInput,
): Promise<void> {
  const sighting = await prisma.sighting.findUnique({
    where: { id: sightingId },
  });

  if (!sighting) {
    throw ApiError.notFound('Sighting not found');
  }

  if (sighting.userId === userId) {
    throw ApiError.badRequest('You cannot confirm your own sighting');
  }

  // Upsert confirmation
  await prisma.sightingConfirmation.upsert({
    where: { sightingId_userId: { sightingId, userId } },
    create: { sightingId, userId, stillAvailable: input.stillAvailable },
    update: { stillAvailable: input.stillAvailable },
  });

  // Update confirmation count
  const confirmCount = await prisma.sightingConfirmation.count({
    where: { sightingId, stillAvailable: true },
  });

  const reportCount = await prisma.sightingConfirmation.count({
    where: { sightingId, stillAvailable: false },
  });

  // Auto-verify if 3+ confirmations
  const isVerified = confirmCount >= 3;

  // Mark as expired if 3+ reports of unavailability
  const shouldExpire = reportCount >= 3;

  await prisma.sighting.update({
    where: { id: sightingId },
    data: {
      confirmCount,
      reportCount,
      isVerified,
      ...(shouldExpire ? { expiresAt: new Date() } : {}),
    },
  });

  // Award points for confirmation
  await pointsService.awardPoints(userId, 'SIGHTING_CONFIRM', sightingId);
}

export async function getSightingById(id: string): Promise<SightingWithRelations> {
  const sighting = await prisma.sighting.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      beer: {
        select: { id: true, name: true, slug: true, imageUrl: true },
      },
      _count: {
        select: { confirmations: true },
      },
    },
  });

  if (!sighting) {
    throw ApiError.notFound('Sighting not found');
  }

  return sighting;
}

async function notifyBeerAlerts(beerId: string, sighting: SightingWithRelations): Promise<void> {
  // Find users with alerts for this beer
  const alerts = await prisma.beerAlert.findMany({
    where: {
      beerId,
      isActive: true,
    },
    include: {
      user: { select: { email: true } },
    },
  });

  for (const alert of alerts) {
    // Check if sighting is within user's radius
    if (alert.latitude && alert.longitude) {
      const distance = calculateDistance(
        alert.latitude,
        alert.longitude,
        sighting.latitude,
        sighting.longitude,
      );
      if (distance > alert.radius) {
        continue; // Too far away
      }
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: alert.userId,
        type: 'SIGHTING',
        title: `${sighting.beer.name} spotted!`,
        message: `Found at ${sighting.locationName}`,
        data: {
          sightingId: sighting.id,
          beerId: sighting.beerId,
          location: sighting.locationName,
        },
      },
    });
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
