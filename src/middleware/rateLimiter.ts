import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis.js';
import { Request, Response, NextFunction } from 'express';

// Standard API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - ioredis call() is compatible with sendCommand
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:api:',
  }),
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

// Auth endpoints rate limiter (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - ioredis call() is compatible with sendCommand
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:auth:',
  }),
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
});

// Scan rate limiter - uses Redis for persistence
export async function checkScanLimit(
  userId: string,
  tier: 'FREE' | 'PRO' | 'UNLIMITED',
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const limits = {
    FREE: 10, // 10 scans per month
    PRO: -1, // Unlimited
    UNLIMITED: -1, // Unlimited
  };

  const limit = limits[tier];

  // Unlimited tiers
  if (limit === -1) {
    return { allowed: true, remaining: -1, resetAt: new Date() };
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const key = `scan_limit:${userId}:${startOfMonth.toISOString().slice(0, 7)}`;

  const count = await redis.incr(key);

  // Set expiry on first increment
  if (count === 1) {
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const ttl = Math.ceil((endOfMonth.getTime() - now.getTime()) / 1000);
    await redis.expire(key, ttl);
  }

  const resetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  if (count > limit) {
    // Decrement since we can't use this request
    await redis.decr(key);
    return { allowed: false, remaining: 0, resetAt };
  }

  return { allowed: true, remaining: limit - count, resetAt };
}

// Custom tier-based rate limiter middleware
export function tierRateLimiter(feature: string, limits: Record<string, number>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return next();
    }

    const limit = limits[user.membershipTier] ?? limits['FREE'];

    if (limit === -1) {
      return next();
    }

    const now = new Date();
    const key = `${feature}:${user.id}:${now.toISOString().slice(0, 10)}`;

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 24 * 60 * 60); // 24 hours
    }

    if (count > limit) {
      res.status(429).json({
        success: false,
        error: `Daily ${feature} limit exceeded for your tier`,
        code: 'TIER_LIMIT_EXCEEDED',
        limit,
        current: count - 1,
        upgradeUrl: '/subscriptions/plans',
      });
      return;
    }

    next();
  };
}
