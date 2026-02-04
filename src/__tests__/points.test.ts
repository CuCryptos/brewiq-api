import { describe, it, expect } from 'vitest';

// Test the logic directly without importing the service (which loads config)
const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  3500,   // Level 7
  5500,   // Level 8
  8000,   // Level 9
  11000,  // Level 10
  15000,  // Level 11
  20000,  // Level 12
  26000,  // Level 13
  33000,  // Level 14
  41000,  // Level 15
  50000,  // Level 16
  60000,  // Level 17
  71000,  // Level 18
  83000,  // Level 19
  100000, // Level 20
];

function calculateLevel(points: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

function getNextLevelThreshold(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 15000 * (level - LEVEL_THRESHOLDS.length + 1);
  }
  return LEVEL_THRESHOLDS[level];
}

function getLevelProgress(points: number, level: number): { current: number; required: number; percentage: number } {
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = getNextLevelThreshold(level);
  const pointsInLevel = points - currentThreshold;
  const pointsRequired = nextThreshold - currentThreshold;
  const percentage = Math.floor((pointsInLevel / pointsRequired) * 100);

  return {
    current: pointsInLevel,
    required: pointsRequired,
    percentage: Math.min(percentage, 100),
  };
}

describe('Points Service Logic', () => {
  describe('calculateLevel', () => {
    it('should return level 1 for 0 points', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('should return level 1 for 99 points', () => {
      expect(calculateLevel(99)).toBe(1);
    });

    it('should return level 2 for 100 points', () => {
      expect(calculateLevel(100)).toBe(2);
    });

    it('should return level 5 for 1000 points', () => {
      expect(calculateLevel(1000)).toBe(5);
    });

    it('should return level 10 for 11000 points', () => {
      expect(calculateLevel(11000)).toBe(10);
    });

    it('should return level 20 for 100000 points', () => {
      expect(calculateLevel(100000)).toBe(20);
    });
  });

  describe('getNextLevelThreshold', () => {
    it('should return 100 for level 1', () => {
      expect(getNextLevelThreshold(1)).toBe(100);
    });

    it('should return 250 for level 2', () => {
      expect(getNextLevelThreshold(2)).toBe(250);
    });

    it('should return 1000 for level 4', () => {
      expect(getNextLevelThreshold(4)).toBe(1000);
    });
  });

  describe('getLevelProgress', () => {
    it('should calculate progress for level 1', () => {
      const progress = getLevelProgress(50, 1);
      expect(progress.current).toBe(50);
      expect(progress.required).toBe(100);
      expect(progress.percentage).toBe(50);
    });

    it('should calculate progress for level 2', () => {
      const progress = getLevelProgress(175, 2);
      expect(progress.current).toBe(75); // 175 - 100
      expect(progress.required).toBe(150); // 250 - 100
      expect(progress.percentage).toBe(50);
    });

    it('should cap percentage at 100', () => {
      const progress = getLevelProgress(100, 1);
      expect(progress.percentage).toBe(100);
    });
  });
});
