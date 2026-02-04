import { prisma } from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { getSkip, paginate, PaginatedResult } from '../../utils/pagination.js';
import { pointsService } from '../../services/points.service.js';
import type { CreateReviewInput, UpdateReviewInput, ReviewQueryInput, VoteInput, CommentInput } from './reviews.schema.js';
import type { Review, Prisma } from '@prisma/client';

type ReviewWithRelations = Review & {
  user: { id: string; username: string; displayName: string | null; avatarUrl: string | null };
  beer: { id: string; name: string; slug: string };
  _count: { votes: number; comments: number };
};

export async function createReview(userId: string, input: CreateReviewInput): Promise<ReviewWithRelations> {
  // Check if beer exists
  const beer = await prisma.beer.findUnique({ where: { id: input.beerId } });
  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  // Check if user already reviewed this beer
  const existingReview = await prisma.review.findUnique({
    where: { userId_beerId: { userId, beerId: input.beerId } },
  });
  if (existingReview) {
    throw ApiError.conflict('You have already reviewed this beer', 'DUPLICATE_REVIEW');
  }

  const review = await prisma.review.create({
    data: {
      userId,
      ...input,
    },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      beer: {
        select: { id: true, name: true, slug: true },
      },
      _count: {
        select: { votes: true, comments: true },
      },
    },
  });

  // Award points for review
  await pointsService.awardPoints(userId, 'REVIEW', review.id);

  // Update beer's average rating
  await updateBeerStats(input.beerId);

  return review;
}

export async function getReviewById(id: string): Promise<ReviewWithRelations> {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      beer: {
        select: { id: true, name: true, slug: true },
      },
      _count: {
        select: { votes: true, comments: true },
      },
    },
  });

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  return review;
}

export async function getReviews(query: ReviewQueryInput): Promise<PaginatedResult<ReviewWithRelations>> {
  const where: Prisma.ReviewWhereInput = {};

  if (query.beerId) {
    where.beerId = query.beerId;
  }

  if (query.userId) {
    where.userId = query.userId;
  }

  if (query.minRating !== undefined || query.maxRating !== undefined) {
    where.rating = {};
    if (query.minRating !== undefined) where.rating.gte = query.minRating;
    if (query.maxRating !== undefined) where.rating.lte = query.maxRating;
  }

  if (query.isVerified !== undefined) {
    where.isVerified = query.isVerified;
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        beer: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { votes: true, comments: true },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: query.sortBy
        ? { [query.sortBy]: query.sortOrder }
        : { createdAt: 'desc' },
    }),
    prisma.review.count({ where }),
  ]);

  return paginate(reviews, total, query);
}

export async function updateReview(id: string, userId: string, input: UpdateReviewInput): Promise<ReviewWithRelations> {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  if (review.userId !== userId) {
    throw ApiError.forbidden('You can only edit your own reviews');
  }

  const updated = await prisma.review.update({
    where: { id },
    data: input,
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      beer: {
        select: { id: true, name: true, slug: true },
      },
      _count: {
        select: { votes: true, comments: true },
      },
    },
  });

  // Update beer stats if rating changed
  if (input.rating !== undefined) {
    await updateBeerStats(review.beerId);
  }

  return updated;
}

export async function deleteReview(id: string, userId: string): Promise<void> {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  if (review.userId !== userId) {
    throw ApiError.forbidden('You can only delete your own reviews');
  }

  await prisma.review.delete({ where: { id } });

  // Update beer stats
  await updateBeerStats(review.beerId);
}

export async function voteOnReview(reviewId: string, userId: string, input: VoteInput): Promise<void> {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  if (review.userId === userId) {
    throw ApiError.badRequest('You cannot vote on your own review');
  }

  // Upsert the vote
  await prisma.reviewVote.upsert({
    where: { userId_reviewId: { userId, reviewId } },
    create: { userId, reviewId, isHelpful: input.isHelpful },
    update: { isHelpful: input.isHelpful },
  });

  // Update helpful count
  const helpfulCount = await prisma.reviewVote.count({
    where: { reviewId, isHelpful: true },
  });

  await prisma.review.update({
    where: { id: reviewId },
    data: { helpfulCount },
  });
}

export async function removeVote(reviewId: string, userId: string): Promise<void> {
  await prisma.reviewVote.deleteMany({
    where: { reviewId, userId },
  });

  // Update helpful count
  const helpfulCount = await prisma.reviewVote.count({
    where: { reviewId, isHelpful: true },
  });

  await prisma.review.update({
    where: { id: reviewId },
    data: { helpfulCount },
  });
}

export async function getReviewComments(reviewId: string, query: ReviewQueryInput) {
  const [comments, total] = await Promise.all([
    prisma.reviewComment.findMany({
      where: { reviewId },
      orderBy: { createdAt: 'asc' },
      skip: getSkip(query),
      take: query.limit,
    }),
    prisma.reviewComment.count({ where: { reviewId } }),
  ]);

  return paginate(comments, total, query);
}

export async function addComment(reviewId: string, userId: string, input: CommentInput) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  return prisma.reviewComment.create({
    data: {
      reviewId,
      userId,
      content: input.content,
    },
  });
}

async function updateBeerStats(beerId: string): Promise<void> {
  const stats = await prisma.review.aggregate({
    where: { beerId },
    _avg: { rating: true },
    _count: true,
  });

  // Calculate IQ score based on rating and review count
  const avgRating = stats._avg.rating || 0;
  const reviewCount = stats._count || 0;
  const iqScore = Math.round((avgRating / 5) * 80 + Math.min(reviewCount / 10, 20));

  // Determine tier
  let tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' = 'BRONZE';
  if (iqScore >= 90) tier = 'DIAMOND';
  else if (iqScore >= 80) tier = 'PLATINUM';
  else if (iqScore >= 70) tier = 'GOLD';
  else if (iqScore >= 60) tier = 'SILVER';

  await prisma.beer.update({
    where: { id: beerId },
    data: { iqScore, tier },
  });
}
