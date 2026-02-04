import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { prisma } from '../../config/database.js';
import { getSkip, paginate, paginationSchema } from '../../utils/pagination.js';
import { validate } from '../../middleware/validate.js';

const router = Router();

router.use(authenticate);

// Get notifications
router.get('/', validate(paginationSchema, 'query'), asyncHandler(async (req, res) => {
  const query = req.query as any;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: req.user!.id },
      skip: getSkip(query),
      take: query.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where: { userId: req.user!.id } }),
  ]);

  const unreadCount = await prisma.notification.count({
    where: { userId: req.user!.id, isRead: false },
  });

  res.json({
    success: true,
    ...paginate(notifications, total, query),
    unreadCount,
  });
}));

// Mark notification as read
router.patch('/:id/read', asyncHandler(async (req, res) => {
  const id = req.params.id as string;
  await prisma.notification.update({
    where: { id, userId: req.user!.id },
    data: { isRead: true },
  });

  res.json({
    success: true,
    message: 'Notification marked as read',
  });
}));

// Mark all as read
router.post('/read-all', asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.id, isRead: false },
    data: { isRead: true },
  });

  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
}));

// Delete notification
router.delete('/:id', asyncHandler(async (req, res) => {
  const id = req.params.id as string;
  await prisma.notification.delete({
    where: { id, userId: req.user!.id },
  });

  res.json({
    success: true,
    message: 'Notification deleted',
  });
}));

export default router;
