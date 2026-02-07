import { Request, Response, NextFunction } from 'express';
import { MembershipTier } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';
import type { AuthenticatedUser } from './auth.js';

type TierLevel = Record<MembershipTier, number>;

const tierLevels: TierLevel = {
  FREE: 0,
  PRO: 1,
  UNLIMITED: 2,
};

export function requireTier(minimumTier: MembershipTier) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthenticatedUser | undefined;

    if (!user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const userLevel = tierLevels[user.membershipTier];
    const requiredLevel = tierLevels[minimumTier];

    if (userLevel < requiredLevel) {
      throw ApiError.forbidden(`This feature requires ${minimumTier} membership or higher`, 'TIER_REQUIRED');
    }

    next();
  };
}

export function requirePro(req: Request, res: Response, next: NextFunction) {
  return requireTier('PRO')(req, res, next);
}

export function requireUnlimited(req: Request, res: Response, next: NextFunction) {
  return requireTier('UNLIMITED')(req, res, next);
}

// Feature flags by tier
export const TIER_FEATURES = {
  FREE: {
    maxScansPerMonth: 10,
    maxSavedBeers: 50,
    cloneRecipes: false,
    aiRecommendations: false,
    apiAccess: false,
    prioritySupport: false,
  },
  PRO: {
    maxScansPerMonth: -1, // Unlimited
    maxSavedBeers: -1,
    cloneRecipes: true,
    aiRecommendations: true,
    apiAccess: false,
    prioritySupport: false,
  },
  UNLIMITED: {
    maxScansPerMonth: -1,
    maxSavedBeers: -1,
    cloneRecipes: true,
    aiRecommendations: true,
    apiAccess: true,
    prioritySupport: true,
  },
};

export function getTierFeatures(tier: MembershipTier) {
  return TIER_FEATURES[tier];
}

export function hasFeature(tier: MembershipTier, feature: keyof typeof TIER_FEATURES.FREE): boolean {
  const features = TIER_FEATURES[tier];
  const value = features[feature];

  if (typeof value === 'boolean') {
    return value;
  }

  return value !== 0;
}
