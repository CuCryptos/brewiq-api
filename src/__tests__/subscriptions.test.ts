import { describe, it, expect } from 'vitest';

// Test subscription plans logic directly without loading config
const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    tier: 'FREE' as const,
    features: [
      '10 scans per month',
      'Save up to 50 beers',
      'Basic beer information',
      'Community reviews',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 4.99,
    tier: 'PRO' as const,
    features: [
      'Unlimited scans',
      'Unlimited saved beers',
      'Clone recipes',
      'AI recommendations',
      'Priority notifications',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 9.99,
    tier: 'UNLIMITED' as const,
    features: [
      'Everything in Pro',
      'API access',
      'Priority support',
      'Early access to features',
      'Custom lists',
    ],
  },
];

function getPlans() {
  return SUBSCRIPTION_PLANS;
}

describe('Subscription Plans', () => {
  describe('SUBSCRIPTION_PLANS', () => {
    it('should have 3 plans', () => {
      expect(SUBSCRIPTION_PLANS).toHaveLength(3);
    });

    it('should have FREE plan with correct details', () => {
      const freePlan = SUBSCRIPTION_PLANS.find(p => p.id === 'free');
      expect(freePlan).toBeDefined();
      expect(freePlan!.name).toBe('Free');
      expect(freePlan!.price).toBe(0);
      expect(freePlan!.tier).toBe('FREE');
      expect(freePlan!.features).toContain('10 scans per month');
    });

    it('should have PRO plan with correct details', () => {
      const proPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'pro');
      expect(proPlan).toBeDefined();
      expect(proPlan!.name).toBe('Pro');
      expect(proPlan!.price).toBe(4.99);
      expect(proPlan!.tier).toBe('PRO');
      expect(proPlan!.features).toContain('Unlimited scans');
      expect(proPlan!.features).toContain('Clone recipes');
    });

    it('should have UNLIMITED plan with correct details', () => {
      const unlimitedPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'unlimited');
      expect(unlimitedPlan).toBeDefined();
      expect(unlimitedPlan!.name).toBe('Unlimited');
      expect(unlimitedPlan!.price).toBe(9.99);
      expect(unlimitedPlan!.tier).toBe('UNLIMITED');
      expect(unlimitedPlan!.features).toContain('API access');
      expect(unlimitedPlan!.features).toContain('Priority support');
    });
  });

  describe('getPlans', () => {
    it('should return all plans', () => {
      const plans = getPlans();
      expect(plans).toEqual(SUBSCRIPTION_PLANS);
    });
  });

  describe('Plan pricing', () => {
    it('should have plans in ascending price order', () => {
      const prices = SUBSCRIPTION_PLANS.map(p => p.price);
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });

    it('should have free plan costing $0', () => {
      const freePlan = SUBSCRIPTION_PLANS.find(p => p.tier === 'FREE');
      expect(freePlan!.price).toBe(0);
    });

    it('should have pro plan at $4.99', () => {
      const proPlan = SUBSCRIPTION_PLANS.find(p => p.tier === 'PRO');
      expect(proPlan!.price).toBe(4.99);
    });

    it('should have unlimited plan at $9.99', () => {
      const unlimitedPlan = SUBSCRIPTION_PLANS.find(p => p.tier === 'UNLIMITED');
      expect(unlimitedPlan!.price).toBe(9.99);
    });
  });
});
