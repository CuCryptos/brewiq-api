import { prisma } from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { getSkip, paginate, PaginatedResult } from '../../utils/pagination.js';
import { pointsService } from '../../services/points.service.js';
import type { UpdateUserInput, UserQueryInput } from './users.schema.js';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  membershipTier: string;
  points: number;
  level: number;
  isVerified: boolean;
  createdAt: Date;
  stats: {
    reviews: number;
    sightings: number;
    scans: number;
    followers: number;
    following: number;
    achievements: number;
  };
  levelProgress: {
    current: number;
    required: number;
    percentage: number;
  };
}

export async function getUserByUsername(username: string, currentUserId?: string): Promise<UserProfile & { isFollowing?: boolean }> {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      membershipTier: true,
      points: true,
      level: true,
      isVerified: true,
      createdAt: true,
      _count: {
        select: {
          reviews: true,
          sightings: true,
          scans: true,
          followers: true,
          following: true,
          userAchievements: { where: { unlockedAt: { not: null } } },
        },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Check if current user is following
  let isFollowing: boolean | undefined;
  if (currentUserId && currentUserId !== user.id) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  const levelProgress = pointsService.getLevelProgress(user.points, user.level);

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    membershipTier: user.membershipTier,
    points: user.points,
    level: user.level,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    stats: {
      reviews: user._count.reviews,
      sightings: user._count.sightings,
      scans: user._count.scans,
      followers: user._count.followers,
      following: user._count.following,
      achievements: user._count.userAchievements,
    },
    levelProgress,
    isFollowing,
  };
}

export async function updateUser(userId: string, input: UpdateUserInput) {
  return prisma.user.update({
    where: { id: userId },
    data: input,
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      membershipTier: true,
      points: true,
      level: true,
    },
  });
}

export async function getUserStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      points: true,
      level: true,
      _count: {
        select: {
          reviews: true,
          sightings: true,
          scans: true,
          checkins: true,
          savedBeers: true,
          wishlistBeers: true,
          userAchievements: { where: { unlockedAt: { not: null } } },
        },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Get recent activity
  const [recentReviews, recentSightings, recentScans] = await Promise.all([
    prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        beer: { select: { name: true, slug: true } },
      },
    }),
    prisma.sighting.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        beer: { select: { name: true, slug: true } },
      },
    }),
    prisma.scan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  // Get style preferences based on reviews
  const styleStats = await prisma.review.groupBy({
    by: ['beerId'],
    where: { userId },
    _avg: { rating: true },
    _count: true,
  });

  const levelProgress = pointsService.getLevelProgress(user.points, user.level);

  return {
    points: user.points,
    level: user.level,
    levelProgress,
    counts: user._count,
    recentActivity: {
      reviews: recentReviews,
      sightings: recentSightings,
      scans: recentScans,
    },
  };
}

export async function followUser(followerId: string, username: string): Promise<void> {
  const userToFollow = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!userToFollow) {
    throw ApiError.notFound('User not found');
  }

  if (userToFollow.id === followerId) {
    throw ApiError.badRequest('You cannot follow yourself');
  }

  await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId,
        followingId: userToFollow.id,
      },
    },
    create: {
      followerId,
      followingId: userToFollow.id,
    },
    update: {},
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId: userToFollow.id,
      type: 'FOLLOW',
      title: 'New follower',
      message: `Someone started following you`,
      data: { followerId },
    },
  });
}

export async function unfollowUser(followerId: string, username: string): Promise<void> {
  const userToUnfollow = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!userToUnfollow) {
    throw ApiError.notFound('User not found');
  }

  await prisma.follow.deleteMany({
    where: {
      followerId,
      followingId: userToUnfollow.id,
    },
  });
}

export async function getFollowers(username: string, query: UserQueryInput) {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const [followers, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: user.id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            level: true,
          },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.follow.count({ where: { followingId: user.id } }),
  ]);

  return paginate(followers.map(f => f.follower), total, query);
}

export async function getFollowing(username: string, query: UserQueryInput) {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const [following, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: user.id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            level: true,
          },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.follow.count({ where: { followerId: user.id } }),
  ]);

  return paginate(following.map(f => f.following), total, query);
}

export async function getSavedBeers(userId: string, query: UserQueryInput) {
  const [saved, total] = await Promise.all([
    prisma.savedBeer.findMany({
      where: { userId },
      include: {
        beer: {
          include: {
            brewery: { select: { name: true, slug: true } },
          },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.savedBeer.count({ where: { userId } }),
  ]);

  return paginate(saved.map(s => s.beer), total, query);
}

export async function getWishlist(userId: string, query: UserQueryInput) {
  const [wishlist, total] = await Promise.all([
    prisma.wishlistBeer.findMany({
      where: { userId },
      include: {
        beer: {
          include: {
            brewery: { select: { name: true, slug: true } },
          },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.wishlistBeer.count({ where: { userId } }),
  ]);

  return paginate(wishlist, total, query);
}
