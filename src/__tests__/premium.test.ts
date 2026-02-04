import { describe, it, expect } from 'vitest';
import { TIER_FEATURES, getTierFeatures, hasFeature } from '../middleware/premium.js';

describe('Premium Features', () => {
  describe('TIER_FEATURES', () => {
    it('should have correct FREE tier features', () => {
      expect(TIER_FEATURES.FREE.maxScansPerMonth).toBe(10);
      expect(TIER_FEATURES.FREE.maxSavedBeers).toBe(50);
      expect(TIER_FEATURES.FREE.cloneRecipes).toBe(false);
      expect(TIER_FEATURES.FREE.aiRecommendations).toBe(false);
      expect(TIER_FEATURES.FREE.apiAccess).toBe(false);
    });

    it('should have correct PRO tier features', () => {
      expect(TIER_FEATURES.PRO.maxScansPerMonth).toBe(-1);
      expect(TIER_FEATURES.PRO.maxSavedBeers).toBe(-1);
      expect(TIER_FEATURES.PRO.cloneRecipes).toBe(true);
      expect(TIER_FEATURES.PRO.aiRecommendations).toBe(true);
      expect(TIER_FEATURES.PRO.apiAccess).toBe(false);
    });

    it('should have correct UNLIMITED tier features', () => {
      expect(TIER_FEATURES.UNLIMITED.maxScansPerMonth).toBe(-1);
      expect(TIER_FEATURES.UNLIMITED.cloneRecipes).toBe(true);
      expect(TIER_FEATURES.UNLIMITED.apiAccess).toBe(true);
      expect(TIER_FEATURES.UNLIMITED.prioritySupport).toBe(true);
    });
  });

  describe('getTierFeatures', () => {
    it('should return features for FREE tier', () => {
      const features = getTierFeatures('FREE');
      expect(features).toEqual(TIER_FEATURES.FREE);
    });

    it('should return features for PRO tier', () => {
      const features = getTierFeatures('PRO');
      expect(features).toEqual(TIER_FEATURES.PRO);
    });

    it('should return features for UNLIMITED tier', () => {
      const features = getTierFeatures('UNLIMITED');
      expect(features).toEqual(TIER_FEATURES.UNLIMITED);
    });
  });

  describe('hasFeature', () => {
    it('should return false for FREE tier clone recipes', () => {
      expect(hasFeature('FREE', 'cloneRecipes')).toBe(false);
    });

    it('should return true for PRO tier clone recipes', () => {
      expect(hasFeature('PRO', 'cloneRecipes')).toBe(true);
    });

    it('should return false for PRO tier API access', () => {
      expect(hasFeature('PRO', 'apiAccess')).toBe(false);
    });

    it('should return true for UNLIMITED tier API access', () => {
      expect(hasFeature('UNLIMITED', 'apiAccess')).toBe(true);
    });

    it('should return true for limited numeric features', () => {
      expect(hasFeature('FREE', 'maxScansPerMonth')).toBe(true); // 10 > 0
      expect(hasFeature('FREE', 'maxSavedBeers')).toBe(true); // 50 > 0
    });
  });
});
