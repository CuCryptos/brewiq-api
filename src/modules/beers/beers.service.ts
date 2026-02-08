import slugifyLib from 'slugify';
const slugify = (slugifyLib as any).default || slugifyLib;
import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import { ApiError } from '../../utils/ApiError.js';
import { getSkip, paginate, PaginatedResult } from '../../utils/pagination.js';
import type { CreateBeerInput, UpdateBeerInput, BeerQueryInput } from './beers.schema.js';
import type { Beer, Prisma } from '@prisma/client';

type BeerWithRelations = Beer & {
  brewery: { id: string; name: string; slug: string };
  _count: { reviews: number; sightings: number };
};

// Transform Prisma beer to API response shape (reviewCount, averageRating)
function transformBeer(beer: BeerWithRelations, averageRating: number = 0) {
  const { _count, ...rest } = beer;
  return {
    ...rest,
    reviewCount: _count?.reviews || 0,
    sightingCount: _count?.sightings || 0,
    averageRating: Math.round(averageRating * 10) / 10,
  };
}

async function attachAverageRatings(beers: BeerWithRelations[]) {
  if (beers.length === 0) return [];
  const beerIds = beers.map(b => b.id);
  const avgRatings = await prisma.review.groupBy({
    by: ['beerId'],
    where: { beerId: { in: beerIds } },
    _avg: { rating: true },
  });
  const avgMap = new Map(avgRatings.map(r => [r.beerId, r._avg.rating || 0]));
  return beers.map(b => transformBeer(b, avgMap.get(b.id) || 0));
}

export async function createBeer(input: CreateBeerInput): Promise<Beer> {
  // Verify brewery exists
  const brewery = await prisma.brewery.findUnique({
    where: { id: input.breweryId },
  });
  if (!brewery) {
    throw ApiError.notFound('Brewery not found');
  }

  // Generate slug
  const baseSlug = slugify(`${brewery.name}-${input.name}`, { lower: true, strict: true });
  const slug = await generateUniqueSlug(baseSlug);

  return prisma.beer.create({
    data: {
      name: input.name,
      breweryId: input.breweryId,
      style: input.style,
      substyle: input.substyle,
      abv: input.abv,
      ibu: input.ibu,
      srm: input.srm,
      description: input.description,
      flavorTags: input.flavorTags,
      foodPairings: input.foodPairings,
      availability: input.availability,
      slug,
    },
  });
}

export async function getBeerBySlug(slug: string) {
  const [beer, avgResult] = await Promise.all([
    prisma.beer.findUnique({
      where: { slug },
      include: {
        brewery: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { reviews: true, sightings: true },
        },
      },
    }),
    prisma.review.aggregate({
      where: { beer: { slug } },
      _avg: { rating: true },
    }),
  ]);

  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  return transformBeer(beer, avgResult._avg.rating || 0);
}

export async function getBeers(query: BeerQueryInput) {
  const where: Prisma.BeerWhereInput = {
    isRetired: false,
  };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { style: { contains: query.search, mode: 'insensitive' } },
      { brewery: { name: { contains: query.search, mode: 'insensitive' } } },
    ];
  }

  if (query.style) {
    where.style = { equals: query.style, mode: 'insensitive' };
  }

  if (query.breweryId) {
    where.breweryId = query.breweryId;
  }

  if (query.tier) {
    where.tier = query.tier;
  }

  if (query.minAbv !== undefined || query.maxAbv !== undefined) {
    where.abv = {};
    if (query.minAbv !== undefined) where.abv.gte = query.minAbv;
    if (query.maxAbv !== undefined) where.abv.lte = query.maxAbv;
  }

  if (query.minIbu !== undefined || query.maxIbu !== undefined) {
    where.ibu = {};
    if (query.minIbu !== undefined) where.ibu.gte = query.minIbu;
    if (query.maxIbu !== undefined) where.ibu.lte = query.maxIbu;
  }

  if (query.minIqScore !== undefined) {
    where.iqScore = { gte: query.minIqScore };
  }

  const [beers, total] = await Promise.all([
    prisma.beer.findMany({
      where,
      include: {
        brewery: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { reviews: true, sightings: true },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: query.sortBy
        ? { [query.sortBy]: query.sortOrder }
        : { iqScore: 'desc' },
    }),
    prisma.beer.count({ where }),
  ]);

  const transformed = await attachAverageRatings(beers);
  return paginate(transformed, total, query);
}

export async function updateBeer(slug: string, input: UpdateBeerInput): Promise<Beer> {
  const beer = await prisma.beer.findUnique({ where: { slug } });
  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  // If name changes, update slug
  let newSlug = slug;
  if (input.name && input.name !== beer.name) {
    const brewery = await prisma.brewery.findUnique({ where: { id: beer.breweryId } });
    const baseSlug = slugify(`${brewery?.name}-${input.name}`, { lower: true, strict: true });
    newSlug = await generateUniqueSlug(baseSlug, beer.id);
  }

  return prisma.beer.update({
    where: { slug },
    data: {
      name: input.name,
      style: input.style,
      substyle: input.substyle,
      abv: input.abv,
      ibu: input.ibu,
      srm: input.srm,
      description: input.description,
      flavorTags: input.flavorTags,
      foodPairings: input.foodPairings,
      availability: input.availability,
      slug: newSlug,
    },
  });
}

export async function deleteBeer(slug: string): Promise<void> {
  const beer = await prisma.beer.findUnique({ where: { slug } });
  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  // Soft delete by marking as retired
  await prisma.beer.update({
    where: { slug },
    data: { isRetired: true },
  });
}

export async function getTrendingBeers(limit = 10) {
  const cacheKey = `trending_beers:${limit}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Get beers with most activity in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const beers = await prisma.beer.findMany({
    where: {
      isRetired: false,
      OR: [
        { reviews: { some: { createdAt: { gte: sevenDaysAgo } } } },
        { sightings: { some: { createdAt: { gte: sevenDaysAgo } } } },
        { scans: { some: { createdAt: { gte: sevenDaysAgo } } } },
      ],
    },
    include: {
      brewery: {
        select: { id: true, name: true, slug: true },
      },
      _count: {
        select: { reviews: true, sightings: true },
      },
    },
    orderBy: [
      { iqScore: 'desc' },
      { reviews: { _count: 'desc' } },
    ],
    take: limit,
  });

  const transformed = await attachAverageRatings(beers);
  await redis.setex(cacheKey, 300, JSON.stringify(transformed));

  return transformed;
}

export async function getBeerReviews(slug: string, query: BeerQueryInput) {
  const beer = await prisma.beer.findUnique({ where: { slug } });
  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { beerId: beer.id },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        _count: {
          select: { votes: true, comments: true },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count({ where: { beerId: beer.id } }),
  ]);

  // Transform user.avatarUrl -> user.avatar to match frontend type
  const transformed = reviews.map(r => {
    const { avatarUrl, ...userRest } = r.user;
    return { ...r, user: { ...userRest, avatar: avatarUrl } };
  });

  return paginate(transformed, total, query);
}

export async function saveBeer(userId: string, slug: string): Promise<void> {
  const beer = await prisma.beer.findUnique({ where: { slug } });
  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  await prisma.savedBeer.upsert({
    where: { userId_beerId: { userId, beerId: beer.id } },
    create: { userId, beerId: beer.id },
    update: {},
  });
}

export async function unsaveBeer(userId: string, slug: string): Promise<void> {
  const beer = await prisma.beer.findUnique({ where: { slug } });
  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  await prisma.savedBeer.deleteMany({
    where: { userId, beerId: beer.id },
  });
}

export async function addToWishlist(userId: string, slug: string, priority = 0, notes?: string): Promise<void> {
  const beer = await prisma.beer.findUnique({ where: { slug } });
  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  await prisma.wishlistBeer.upsert({
    where: { userId_beerId: { userId, beerId: beer.id } },
    create: { userId, beerId: beer.id, priority, notes },
    update: { priority, notes },
  });
}

export async function removeFromWishlist(userId: string, slug: string): Promise<void> {
  const beer = await prisma.beer.findUnique({ where: { slug } });
  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  await prisma.wishlistBeer.deleteMany({
    where: { userId, beerId: beer.id },
  });
}

async function generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 0;
  const MAX_ITERATIONS = 100;

  while (counter < MAX_ITERATIONS) {
    const candidate = counter === 0 ? slug : `${slug}-${counter}`;
    const existing = await prisma.beer.findUnique({ where: { slug: candidate } });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    counter++;
  }

  throw new Error(`Failed to generate unique slug after ${MAX_ITERATIONS} attempts`);
}
