import { prisma } from '../../config/database.js';
import { notifyAchievement } from '../../websocket/index.js';
import { getSkip, paginate } from '../../utils/pagination.js';
import type { PaginationParams } from '../../utils/pagination.js';

export async function getAchievements(query: PaginationParams) {
  const [achievements, total] = await Promise.all([
    prisma.achievement.findMany({
      where: { isActive: true },
      skip: getSkip(query),
      take: query.limit,
      orderBy: [{ rarity: 'desc' }, { pointsAwarded: 'desc' }],
    }),
    prisma.achievement.count({ where: { isActive: true } }),
  ]);

  return paginate(achievements, total, query);
}

export async function getUserAchievements(userId: string, query: PaginationParams) {
  const [userAchievements, total] = await Promise.all([
    prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: { unlockedAt: 'desc' },
    }),
    prisma.userAchievement.count({ where: { userId } }),
  ]);

  return paginate(userAchievements, total, query);
}

export async function checkAndAwardAchievements(userId: string): Promise<void> {
  const achievements = await prisma.achievement.findMany({
    where: { isActive: true },
  });

  for (const achievement of achievements) {
    const alreadyUnlocked = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: { userId, achievementId: achievement.id },
      },
    });

    if (alreadyUnlocked?.unlockedAt) {
      continue; // Already has this achievement
    }

    const criteria = achievement.criteria as Record<string, unknown>;
    const progress = await checkProgress(userId, criteria);

    if (progress.met) {
      // Award achievement
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: { userId, achievementId: achievement.id },
        },
        create: {
          userId,
          achievementId: achievement.id,
          progress: progress.current,
          unlockedAt: new Date(),
        },
        update: {
          progress: progress.current,
          unlockedAt: new Date(),
        },
      });

      // Award points
      await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: achievement.pointsAwarded } },
      });

      // Send notification
      notifyAchievement(userId, {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        iconUrl: achievement.iconUrl || undefined,
        pointsAwarded: achievement.pointsAwarded,
      });
    } else if (progress.current > 0) {
      // Update progress
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: { userId, achievementId: achievement.id },
        },
        create: {
          userId,
          achievementId: achievement.id,
          progress: progress.current,
        },
        update: {
          progress: progress.current,
        },
      });
    }
  }
}

async function checkProgress(
  userId: string,
  criteria: Record<string, unknown>,
): Promise<{ met: boolean; current: number; required: number }> {
  const type = criteria.type as string;
  const required = (criteria.count as number) || 1;

  let current = 0;

  switch (type) {
    case 'reviews_count':
      current = await prisma.review.count({ where: { userId } });
      break;
    case 'sightings_count':
      current = await prisma.sighting.count({ where: { userId } });
      break;
    case 'scans_count':
      current = await prisma.scan.count({ where: { userId } });
      break;
    case 'checkins_count':
      current = await prisma.checkin.count({ where: { userId } });
      break;
    case 'unique_styles':
      const styles = await prisma.review.findMany({
        where: { userId },
        select: { beer: { select: { style: true } } },
        distinct: ['beerId'],
      });
      current = new Set(styles.map(r => r.beer.style)).size;
      break;
    case 'unique_breweries':
      const breweries = await prisma.review.findMany({
        where: { userId },
        select: { beer: { select: { breweryId: true } } },
        distinct: ['beerId'],
      });
      current = new Set(breweries.map(r => r.beer.breweryId)).size;
      break;
    case 'followers_count':
      current = await prisma.follow.count({ where: { followingId: userId } });
      break;
    case 'helpful_votes':
      const reviews = await prisma.review.findMany({
        where: { userId },
        select: { helpfulCount: true },
      });
      current = reviews.reduce((sum, r) => sum + r.helpfulCount, 0);
      break;
    case 'level':
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { level: true },
      });
      current = user?.level || 0;
      break;
    default:
      return { met: false, current: 0, required };
  }

  return {
    met: current >= required,
    current,
    required,
  };
}

export async function getAchievementById(id: string) {
  return prisma.achievement.findUnique({ where: { id } });
}
