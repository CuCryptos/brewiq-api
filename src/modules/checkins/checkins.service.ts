import { prisma } from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { getSkip, paginate } from '../../utils/pagination.js';
import { pointsService } from '../../services/points.service.js';
import { uploadService } from '../../services/upload.service.js';
import { checkAndAwardAchievements } from '../achievements/achievements.service.js';
import type { CreateCheckinInput, CheckinQueryInput } from './checkins.schema.js';

export async function createCheckin(userId: string, input: CreateCheckinInput) {
  // Verify beer exists
  const beer = await prisma.beer.findUnique({ where: { id: input.beerId } });
  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  // Upload image if provided
  let imageUrl: string | undefined;
  if (input.image) {
    const uploaded = await uploadService.uploadImage(input.image, 'brewiq/checkins');
    imageUrl = uploaded.url;
  }

  const checkin = await prisma.checkin.create({
    data: {
      userId,
      beerId: input.beerId,
      rating: input.rating,
      notes: input.notes,
      locationName: input.locationName,
      latitude: input.latitude,
      longitude: input.longitude,
      imageUrl,
    },
    include: {
      beer: {
        select: { id: true, name: true, slug: true, imageUrl: true },
      },
    },
  });

  // Award points
  await pointsService.awardPoints(userId, 'CHECKIN', checkin.id);

  // Check achievements
  await checkAndAwardAchievements(userId);

  return checkin;
}

export async function getCheckins(userId: string, query: CheckinQueryInput) {
  const where: { userId: string; beerId?: string } = { userId };

  if (query.beerId) {
    where.beerId = query.beerId;
  }

  const [checkins, total] = await Promise.all([
    prisma.checkin.findMany({
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
    prisma.checkin.count({ where }),
  ]);

  return paginate(checkins, total, query);
}

export async function deleteCheckin(id: string, userId: string): Promise<void> {
  const checkin = await prisma.checkin.findUnique({ where: { id } });

  if (!checkin) {
    throw ApiError.notFound('Check-in not found');
  }

  if (checkin.userId !== userId) {
    throw ApiError.forbidden('You can only delete your own check-ins');
  }

  await prisma.checkin.delete({ where: { id } });
}
