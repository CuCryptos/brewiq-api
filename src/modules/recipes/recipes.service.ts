import slugifyLib from 'slugify';
const slugify = (slugifyLib as any).default || slugifyLib;
import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import { claudeService, type CloneRecipeResponse } from '../../services/claude.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { getSkip, paginate, PaginatedResult } from '../../utils/pagination.js';
import type { CreateRecipeInput, UpdateRecipeInput, RecipeQueryInput } from './recipes.schema.js';
import type { Recipe, Prisma, MembershipTier } from '@prisma/client';

type RecipeWithRelations = Recipe & {
  user: { id: string; username: string; displayName: string | null };
  clonedBeer?: { id: string; name: string; slug: string } | null;
};

export async function createRecipe(userId: string, input: CreateRecipeInput): Promise<Recipe> {
  const baseSlug = slugify(input.name, { lower: true, strict: true });
  const slug = await generateUniqueSlug(baseSlug);

  return prisma.recipe.create({
    data: {
      userId,
      name: input.name,
      slug,
      style: input.style,
      type: input.type,
      difficulty: input.difficulty,
      description: input.description,
      clonedBeerId: input.clonedBeerId,
      batchSize: input.batchSize,
      boilTime: input.boilTime,
      estimatedOg: input.estimatedOg,
      estimatedFg: input.estimatedFg,
      estimatedAbv: input.estimatedAbv,
      estimatedIbu: input.estimatedIbu,
      estimatedSrm: input.estimatedSrm,
      grains: input.grains,
      hops: input.hops,
      yeast: input.yeast,
      adjuncts: input.adjuncts,
      mashTemp: input.mashTemp,
      mashTime: input.mashTime,
      fermentTemp: input.fermentTemp,
      fermentDays: input.fermentDays,
      notes: input.notes,
      isPublic: input.isPublic,
    },
  });
}

export async function getRecipes(query: RecipeQueryInput): Promise<PaginatedResult<RecipeWithRelations>> {
  const where: Prisma.RecipeWhereInput = {
    isPublic: true,
  };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { style: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.style) {
    where.style = { equals: query.style, mode: 'insensitive' };
  }

  if (query.type) {
    where.type = query.type;
  }

  if (query.difficulty) {
    where.difficulty = query.difficulty;
  }

  if (query.userId) {
    where.userId = query.userId;
    delete where.isPublic; // Show all recipes for specific user
  }

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true, displayName: true },
        },
        clonedBeer: {
          select: { id: true, name: true, slug: true },
        },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: query.sortBy
        ? { [query.sortBy]: query.sortOrder }
        : { createdAt: 'desc' },
    }),
    prisma.recipe.count({ where }),
  ]);

  return paginate(recipes, total, query);
}

export async function getRecipeBySlug(slug: string, requestingUserId?: string): Promise<RecipeWithRelations> {
  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    include: {
      user: {
        select: { id: true, username: true, displayName: true },
      },
      clonedBeer: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!recipe) {
    throw ApiError.notFound('Recipe not found');
  }

  // Check visibility
  if (!recipe.isPublic && recipe.userId !== requestingUserId) {
    throw ApiError.forbidden('This recipe is private');
  }

  // Increment view count
  await prisma.recipe.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  });

  return recipe;
}

export async function updateRecipe(
  slug: string,
  userId: string,
  input: UpdateRecipeInput,
): Promise<Recipe> {
  const recipe = await prisma.recipe.findUnique({ where: { slug } });

  if (!recipe) {
    throw ApiError.notFound('Recipe not found');
  }

  if (recipe.userId !== userId) {
    throw ApiError.forbidden('You can only edit your own recipes');
  }

  // Generate new slug if name changed
  let newSlug = slug;
  if (input.name && input.name !== recipe.name) {
    const baseSlug = slugify(input.name, { lower: true, strict: true });
    newSlug = await generateUniqueSlug(baseSlug, recipe.id);
  }

  return prisma.recipe.update({
    where: { slug },
    data: {
      ...input,
      slug: newSlug,
      grains: input.grains ?? undefined,
      hops: input.hops ?? undefined,
      yeast: input.yeast ?? undefined,
      adjuncts: input.adjuncts ?? undefined,
    },
  });
}

export async function deleteRecipe(slug: string, userId: string): Promise<void> {
  const recipe = await prisma.recipe.findUnique({ where: { slug } });

  if (!recipe) {
    throw ApiError.notFound('Recipe not found');
  }

  if (recipe.userId !== userId) {
    throw ApiError.forbidden('You can only delete your own recipes');
  }

  await prisma.recipe.delete({ where: { slug } });
}

export async function generateCloneRecipe(
  userId: string,
  beerId: string,
  tier: MembershipTier,
): Promise<Recipe> {
  // Check tier
  if (tier === 'FREE') {
    throw ApiError.forbidden('Clone recipe generation requires Pro or Unlimited membership');
  }

  // Get beer details
  const beer = await prisma.beer.findUnique({
    where: { id: beerId },
    include: {
      brewery: { select: { name: true } },
    },
  });

  if (!beer) {
    throw ApiError.notFound('Beer not found');
  }

  // Generate recipe using Claude (returns validated CloneRecipeResponse)
  const recipeData: CloneRecipeResponse = await claudeService.generateCloneRecipe(
    beer.name,
    beer.brewery.name,
    beer.style,
  );

  // Create recipe in database — recipeData is fully typed and validated by Zod
  const baseSlug = slugify(`${beer.name}-clone`, { lower: true, strict: true });
  const slug = await generateUniqueSlug(baseSlug);

  const recipe = await prisma.recipe.create({
    data: {
      userId,
      clonedBeerId: beerId,
      name: recipeData.name || `${beer.name} Clone`,
      slug,
      style: recipeData.style || beer.style,
      type: 'CLONE',
      difficulty: recipeData.difficulty,
      description: recipeData.description,
      batchSize: recipeData.batchSize,
      boilTime: recipeData.boilTime,
      estimatedOg: recipeData.estimatedOg,
      estimatedFg: recipeData.estimatedFg,
      estimatedAbv: recipeData.estimatedAbv,
      estimatedIbu: recipeData.estimatedIbu,
      estimatedSrm: recipeData.estimatedSrm,
      grains: recipeData.grains,
      hops: recipeData.hops,
      yeast: recipeData.yeast,
      adjuncts: recipeData.adjuncts,
      mashTemp: recipeData.mashTemp,
      mashTime: recipeData.mashTime,
      fermentTemp: recipeData.fermentTemp,
      fermentDays: recipeData.fermentDays,
      notes: recipeData.notes,
      isPublic: true,
    },
    include: {
      clonedBeer: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return recipe;
}

export async function markBrewed(slug: string, userId: string): Promise<void> {
  const redisKey = `brewed:${userId}:${slug}`;
  const alreadyBrewed = await redis.get(redisKey);

  if (alreadyBrewed) {
    throw ApiError.conflict('You have already marked this recipe as brewed');
  }

  await redis.set(redisKey, '1');
  await prisma.recipe.update({
    where: { slug },
    data: { brewCount: { increment: 1 } },
  });
}

async function generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 0;
  const MAX_ITERATIONS = 100;

  while (counter < MAX_ITERATIONS) {
    const candidate = counter === 0 ? slug : `${slug}-${counter}`;
    const existing = await prisma.recipe.findUnique({ where: { slug: candidate } });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    counter++;
  }

  throw new Error(`Failed to generate unique slug after ${MAX_ITERATIONS} attempts`);
}
