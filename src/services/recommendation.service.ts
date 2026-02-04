import { prisma } from '../config/database.js';

export const recommendationService = {
  async getRecommendationsForUser(userId: string, limit = 10) {
    // Get user's reviewed beers and their styles/ratings
    const userReviews = await prisma.review.findMany({
      where: { userId },
      select: {
        rating: true,
        beer: {
          select: { id: true, style: true, breweryId: true, flavorTags: true },
        },
      },
      orderBy: { rating: 'desc' },
    });

    if (userReviews.length === 0) {
      // No reviews - return trending beers
      return this.getTrendingRecommendations(limit);
    }

    // Find preferred styles (weighted by rating)
    const styleScores: Record<string, number> = {};
    const breweryScores: Record<string, number> = {};
    const tagScores: Record<string, number> = {};
    const reviewedBeerIds = new Set<string>();

    for (const review of userReviews) {
      reviewedBeerIds.add(review.beer.id);
      const weight = review.rating;

      // Style preference
      styleScores[review.beer.style] = (styleScores[review.beer.style] || 0) + weight;

      // Brewery preference
      breweryScores[review.beer.breweryId] = (breweryScores[review.beer.breweryId] || 0) + weight;

      // Flavor tag preferences
      for (const tag of review.beer.flavorTags) {
        tagScores[tag] = (tagScores[tag] || 0) + weight;
      }
    }

    // Get top preferred styles
    const topStyles = Object.entries(styleScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([style]) => style);

    // Get top preferred breweries
    const topBreweries = Object.entries(breweryScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id]) => id);

    // Find beers user hasn't tried that match preferences
    const recommendations = await prisma.beer.findMany({
      where: {
        id: { notIn: Array.from(reviewedBeerIds) },
        isRetired: false,
        OR: [
          { style: { in: topStyles } },
          { breweryId: { in: topBreweries } },
        ],
      },
      include: {
        brewery: { select: { name: true, slug: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { iqScore: 'desc' },
      take: limit,
    });

    return recommendations.map((beer) => ({
      ...beer,
      reason: this.getRecommendationReason(beer, topStyles, topBreweries),
    }));
  },

  async getTrendingRecommendations(limit = 10) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return prisma.beer.findMany({
      where: {
        isRetired: false,
        OR: [
          { reviews: { some: { createdAt: { gte: sevenDaysAgo } } } },
          { sightings: { some: { createdAt: { gte: sevenDaysAgo } } } },
        ],
      },
      include: {
        brewery: { select: { name: true, slug: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { iqScore: 'desc' },
      take: limit,
    });
  },

  async getSimilarBeers(beerId: string, limit = 5) {
    const beer = await prisma.beer.findUnique({
      where: { id: beerId },
      select: { style: true, breweryId: true, flavorTags: true, abv: true },
    });

    if (!beer) return [];

    return prisma.beer.findMany({
      where: {
        id: { not: beerId },
        isRetired: false,
        OR: [
          { style: beer.style },
          { breweryId: beer.breweryId },
          { flavorTags: { hasSome: beer.flavorTags } },
        ],
      },
      include: {
        brewery: { select: { name: true, slug: true } },
      },
      orderBy: { iqScore: 'desc' },
      take: limit,
    });
  },

  getRecommendationReason(
    beer: { style: string; breweryId: string },
    topStyles: string[],
    topBreweries: string[],
  ): string {
    if (topStyles.includes(beer.style)) {
      return `Because you like ${beer.style}`;
    }
    if (topBreweries.includes(beer.breweryId)) {
      return 'From a brewery you enjoy';
    }
    return 'Highly rated';
  },
};
