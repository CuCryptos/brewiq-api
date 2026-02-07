import { prisma } from '../../config/database.js';
import { geminiService } from '../../services/gemini.service.js';
import { ApiError } from '../../utils/ApiError.js';

export async function generateReviewImage(reviewId: string, userId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      beer: true,
    },
  });

  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  if (review.userId !== userId) {
    throw ApiError.forbidden('You can only generate images for your own reviews');
  }

  const imageUrl = await geminiService.generateReviewImage(
    review.beer.name,
    review.beer.style,
    review.rating,
    review.flavorTags,
  );

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: { imageUrl },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      beer: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return updated;
}

export async function generateAvatar(prompt: string) {
  const imageUrl = await geminiService.generateAvatar(prompt);
  return { imageUrl };
}
