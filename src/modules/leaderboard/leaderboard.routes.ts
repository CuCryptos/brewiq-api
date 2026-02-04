import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { pointsService } from '../../services/points.service.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const timeframe = (req.query.timeframe as 'all' | 'month' | 'week') || 'all';

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
