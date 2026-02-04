import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

const POINTS_CONFIG = {
  SCAN: 5,
  REVIEW: 15,
  SIGHTING: 10,
  SIGHTING_CONFIRM: 3,
  CHECKIN: 2,
  FIRST_REVIEW_OF_DAY: 5,
  STREAK_BONUS: 10,
  HELPFUL_VOTE_RECEIVED: 2,
};

const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  3500,   // Level 7
  5500,   // Level 8
  8000,   // Level 9
  11000,  // Level 10
  15000,  // Level 11
  20000,  // Level 12
  26000,  // Level 13
  33000,  // Level 14
  41000,  // Level 15
  50000,  // Level 16
  60000,  // Level 17
  71000,  // Level 18
  83000,  // Level 19
  100000, // Level 20
];

export const pointsService = {
  async awardPoints(
    userId: string,
    action: keyof typeof POINTS_CONFIG,
    referenceId?: string,
  ): Promise<{ points: number; newTotal: number; levelUp: boolean; newLevel: number }> {
    const points = POINTS_CONFIG[action];

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: points },
      },
      select: { points: true, level: true },
    });

    // Check for level up
    const newLevel = this.calculateLevel(user.points);
    const levelUp = newLevel > user.level;

    if (levelUp) {
      await prisma.user.update({
        where: { id: userId },
        data: { level: newLevel },
      });

      logger.info(`User ${userId} leveled up to ${newLevel}`);
    }

    return {
      points,
      newTotal: user.points,
      levelUp,
      newLevel,
    };
  },

  calculateLevel(points: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (points >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  },

  getNextLevelThreshold(level: number): number {
    if (level >= LEVEL_THRESHOLDS.length) {
      return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 15000 * (level - LEVEL_THRESHOLDS.length + 1);
    }
    return LEVEL_THRESHOLDS[level];
  },

  getLevelProgress(points: number, level: number): { current: number; required: number; percentage: number } {
    const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextThreshold = this.getNextLevelThreshold(level);
    const pointsInLevel = points - currentThreshold;
    const pointsRequired = nextThreshold - currentThreshold;
    const percentage = Math.floor((pointsInLevel / pointsRequired) * 100);

    return {
      current: pointsInLevel,
      required: pointsRequired,
      percentage: Math.min(percentage, 100),
    };
  },

  async getLeaderboard(limit = 10, timeframe: 'all' | 'month' | 'week' = 'all') {
    // For now, just get top users by total points
    // A more sophisticated version would track points earned in timeframe
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        points: true,
        level: true,
        _count: {
          select: {
            reviews: true,
            sightings: true,
            scans: true,
          },
        },
      },
      orderBy: { points: 'desc' },
      take: limit,
    });
  },
};
