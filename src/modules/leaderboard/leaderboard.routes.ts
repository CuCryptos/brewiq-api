import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import { pointsService } from '../../services/points.service.js';

const router = Router();

const leaderboardQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  timeframe: z.enum(['all', 'month', 'week']).default('all'),
});

type LeaderboardQuery = z.infer<typeof leaderboardQuerySchema>;

router.get('/', validate(leaderboardQuerySchema, 'query'), asyncHandler(async (req, res) => {
  const { limit, timeframe } = req.query as unknown as LeaderboardQuery;

  const leaderboard = await pointsService.getLeaderboard(limit, timeframe);

  res.json({
    success: true,
    data: leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user,
    })),
  });
}));

export default router;
