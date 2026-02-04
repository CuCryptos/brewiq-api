import slugifyLib from 'slugify';
const slugify = (slugifyLib as any).default || slugifyLib;
import { prisma } from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { getSkip, paginate } from '../../utils/pagination.js';
import type { CreateListInput, UpdateListInput, AddToListInput, ListQueryInput } from './lists.schema.js';

export async function createList(userId: string, input: CreateListInput) {
  const slug = slugify(input.name, { lower: true, strict: true });

  // Check for duplicate slug for this user
  const existing = await prisma.list.findUnique({
    where: { userId_slug: { userId, slug } },
  });

  if (existing) {
    throw ApiError.conflict('You already have a list with this name');
  }

  return prisma.list.create({
    data: {
      userId,
      name: input.name,
      slug,
      description: input.description,
      isPublic: input.isPublic,
    },
    include: {
      _count: { select: { items: true } },
    },
  });
}

export async function getUserLists(userId: string, query: ListQueryInput) {
  const [lists, total] = await Promise.all([
    prisma.list.findMany({
      where: { userId },
      include: {
        _count: { select: { items: true } },
      },
      skip: getSkip(query),
      take: query.limit,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.list.count({ where: { userId } }),
  ]);

  return paginate(lists, total, query);
}

export async function getListBySlug(userId: string, slug: string, requestingUserId?: string) {
  const list = await prisma.list.findUnique({
    where: { userId_slug: { userId, slug } },
    include: {
      user: {
        select: { username: true, displayName: true, avatarUrl: true },
      },
      items: {
        include: {
          beer: {
            include: {
              brewery: { select: { name: true, slug: true } },
            },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!list) {
    throw ApiError.notFound('List not found');
  }

  // Check visibility
  if (!list.isPublic && list.userId !== requestingUserId) {
    throw ApiError.forbidden('This list is private');
  }

  return list;
}

export async function updateList(userId: string, slug: string, input: UpdateListInput) {
  const list = await prisma.list.findUnique({
    where: { userId_slug: { userId, slug } },
  });

  if (!list) {
    throw ApiError.notFound('List not found');
  }

  // Generate new slug if name changed
  let newSlug = slug;
  if (input.name && input.name !== list.name) {
    newSlug = slugify(input.name, { lower: true, strict: true });
  }

  return prisma.list.update({
    where: { id: list.id },
    data: {
      ...input,
      slug: newSlug,
    },
    include: {
      _count: { select: { items: true } },
    },
  });
}

export async function deleteList(userId: string, slug: string): Promise<void> {
  const list = await prisma.list.findUnique({
    where: { userId_slug: { userId, slug } },
  });

  if (!list) {
    throw ApiError.notFound('List not found');
  }

  await prisma.list.delete({ where: { id: list.id } });
}

export async function addBeerToList(userId: string, slug: string, input: AddToListInput) {
  const list = await prisma.list.findUnique({
    where: { userId_slug: { userId, slug } },
  });

  if (!list) {
    throw ApiError.notFound('List not found');
  }

  // Get next order
  const lastItem = await prisma.listItem.findFirst({
    where: { listId: list.id },
    orderBy: { order: 'desc' },
  });
  const order = (lastItem?.order ?? -1) + 1;

  return prisma.listItem.upsert({
    where: {
      listId_beerId: { listId: list.id, beerId: input.beerId },
    },
    create: {
      listId: list.id,
      beerId: input.beerId,
      notes: input.notes,
      order,
    },
    update: {
      notes: input.notes,
    },
    include: {
      beer: {
        include: {
          brewery: { select: { name: true, slug: true } },
        },
      },
    },
  });
}

export async function removeBeerFromList(userId: string, slug: string, beerId: string): Promise<void> {
  const list = await prisma.list.findUnique({
    where: { userId_slug: { userId, slug } },
  });

  if (!list) {
    throw ApiError.notFound('List not found');
  }

  await prisma.listItem.deleteMany({
    where: { listId: list.id, beerId },
  });
}
