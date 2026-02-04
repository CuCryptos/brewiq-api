import slugifyLib from 'slugify';
const slugify = (slugifyLib as any).default || slugifyLib;
import { prisma } from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { getSkip, paginate, PaginatedResult } from '../../utils/pagination.js';
import type { CreateBreweryInput, UpdateBreweryInput, BreweryQueryInput } from './breweries.schema.js';
import type { Brewery, Prisma } from '@prisma/client';

type BreweryWithCounts = Brewery & {
  _count: { beers: number };
};

export async function createBrewery(input: CreateBreweryInput): Promise<Brewery> {
  const baseSlug = slugify(input.name, { lower: true, strict: true });
  const slug = await generateUniqueSlug(baseSlug);

  return prisma.brewery.create({
    data: {
      ...input,
      slug,
    },
  });
}

export async function getBreweryBySlug(slug: string): Promise<BreweryWithCounts> {
  const brewery = await prisma.brewery.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { beers: true },
      },
    },
  });

  if (!brewery) {
    throw ApiError.notFound('Brewery not found');
  }

  return brewery;
}

export async function getBreweries(query: BreweryQueryInput): Promise<PaginatedResult<BreweryWithCounts>> {
  const where: Prisma.BreweryWhereInput = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { city: { contains: query.search, mode: 'insensitive' } },
      { state: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.type) {
    where.type = query.type;
  }

  if (query.city) {
    where.city = { equals: query.city, mode: 'insensitive' };
  }

  if (query.state) {
    where.state = { equals: query.state, mode: 'insensitive' };
  }

  if (query.country) {
    where.country = { equals: query.country, mode: 'insensitive' };
  }

  if (query.hasTaproom !== undefined) {
    where.hasTaproom = query.hasTaproom;
  }

  if (query.hasTours !== undefined) {
    where.hasTours = query.hasTours;
  }

  if (query.hasFood !== undefined) {
    where.hasFood = query.hasFood;
  }

  if (query.dogFriendly !== undefined) {
    where.dogFriendly = query.dogFriendly;
  }

  // Geolocation search
  if (query.near) {
    const [lat, lng] = query.near.split(',').map(parseFloat);
    if (!isNaN(lat) && !isNaN(lng)) {
      // Rough bounding box calculation (1 degree ≈ 69 miles)
      const latDelta = query.radius / 69;
      const lngDelta = query.radius / (69 * Math.cos(lat * Math.PI / 180));

      where.latitude = { gte: lat - latDelta, lte: lat + latDelta };
      where.longitude = { gte: lng - lngDelta, lte: lng + lngDelta };
    }
  }

  const [breweries, total] = await Promise.all([
    prisma.brewery.findMany({
      where,
      include: {
        _count: {
          select: { beers: true },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: query.sortBy
        ? { [query.sortBy]: query.sortOrder }
        : { iqScore: 'desc' },
    }),
    prisma.brewery.count({ where }),
  ]);

  return paginate(breweries, total, query);
}

export async function updateBrewery(slug: string, input: UpdateBreweryInput): Promise<Brewery> {
  const brewery = await prisma.brewery.findUnique({ where: { slug } });
  if (!brewery) {
    throw ApiError.notFound('Brewery not found');
  }

  // If name changes, update slug
  let newSlug = slug;
  if (input.name && input.name !== brewery.name) {
    const baseSlug = slugify(input.name, { lower: true, strict: true });
    newSlug = await generateUniqueSlug(baseSlug, brewery.id);
  }

  return prisma.brewery.update({
    where: { slug },
    data: { ...input, slug: newSlug },
  });
}

export async function deleteBrewery(slug: string): Promise<void> {
  const brewery = await prisma.brewery.findUnique({ where: { slug } });
  if (!brewery) {
    throw ApiError.notFound('Brewery not found');
  }

  // Check if brewery has beers
  const beerCount = await prisma.beer.count({ where: { breweryId: brewery.id } });
  if (beerCount > 0) {
    throw ApiError.badRequest('Cannot delete brewery with existing beers');
  }

  await prisma.brewery.delete({ where: { slug } });
}

export async function getBreweryBeers(slug: string, query: BreweryQueryInput) {
  const brewery = await prisma.brewery.findUnique({ where: { slug } });
  if (!brewery) {
    throw ApiError.notFound('Brewery not found');
  }

  const [beers, total] = await Promise.all([
    prisma.beer.findMany({
      where: { breweryId: brewery.id, isRetired: false },
      include: {
        _count: {
          select: { reviews: true, sightings: true },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: { iqScore: 'desc' },
    }),
    prisma.beer.count({ where: { breweryId: brewery.id, isRetired: false } }),
  ]);

  return paginate(beers, total, query);
}

async function generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 0;

  while (true) {
    const candidate = counter === 0 ? slug : `${slug}-${counter}`;
    const existing = await prisma.brewery.findUnique({ where: { slug: candidate } });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    counter++;
  }
}
