import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../modules/auth/auth.schema.js';
import { createBeerSchema, beerQuerySchema } from '../modules/beers/beers.schema.js';
import { createReviewSchema } from '../modules/reviews/reviews.schema.js';
import { createSightingSchema } from '../modules/sightings/sightings.schema.js';

describe('Auth Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'invalid-email',
        username: 'testuser',
        password: 'Password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short username', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        username: 'ab',
        password: 'Password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        username: 'testuser',
        password: 'weak',
      });
      expect(result.success).toBe(false);
    });

    it('should reject password without uppercase', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject password without number', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        username: 'testuser',
        password: 'PasswordABC',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'anypassword',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('Beer Schemas', () => {
  describe('createBeerSchema', () => {
    it('should validate correct beer data', () => {
      const result = createBeerSchema.safeParse({
        name: 'Test IPA',
        breweryId: '123e4567-e89b-12d3-a456-426614174000',
        style: 'IPA',
        abv: 6.5,
        ibu: 65,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid ABV', () => {
      const result = createBeerSchema.safeParse({
        name: 'Test IPA',
        breweryId: '123e4567-e89b-12d3-a456-426614174000',
        style: 'IPA',
        abv: 150, // Too high
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid IBU', () => {
      const result = createBeerSchema.safeParse({
        name: 'Test IPA',
        breweryId: '123e4567-e89b-12d3-a456-426614174000',
        style: 'IPA',
        ibu: 1500, // Too high
      });
      expect(result.success).toBe(false);
    });
  });

  describe('beerQuerySchema', () => {
    it('should provide defaults', () => {
      const result = beerQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      expect(result.data?.page).toBe(1);
      expect(result.data?.limit).toBe(20);
    });

    it('should validate tier filter', () => {
      const result = beerQuerySchema.safeParse({
        tier: 'DIAMOND',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid tier', () => {
      const result = beerQuerySchema.safeParse({
        tier: 'INVALID',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('Review Schema', () => {
  describe('createReviewSchema', () => {
    it('should validate correct review data', () => {
      const result = createReviewSchema.safeParse({
        beerId: '123e4567-e89b-12d3-a456-426614174000',
        rating: 4.5,
        content: 'Great beer!',
      });
      expect(result.success).toBe(true);
    });

    it('should accept 0.5 increments', () => {
      const result = createReviewSchema.safeParse({
        beerId: '123e4567-e89b-12d3-a456-426614174000',
        rating: 3.5,
      });
      expect(result.success).toBe(true);
    });

    it('should reject rating over 5', () => {
      const result = createReviewSchema.safeParse({
        beerId: '123e4567-e89b-12d3-a456-426614174000',
        rating: 6,
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative rating', () => {
      const result = createReviewSchema.safeParse({
        beerId: '123e4567-e89b-12d3-a456-426614174000',
        rating: -1,
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('Sighting Schema', () => {
  describe('createSightingSchema', () => {
    it('should validate correct sighting data', () => {
      const result = createSightingSchema.safeParse({
        beerId: '123e4567-e89b-12d3-a456-426614174000',
        locationName: 'Local Pub',
        latitude: 40.7128,
        longitude: -74.0060,
        format: 'DRAFT',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid latitude', () => {
      const result = createSightingSchema.safeParse({
        beerId: '123e4567-e89b-12d3-a456-426614174000',
        locationName: 'Local Pub',
        latitude: 100, // Invalid
        longitude: -74.0060,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid longitude', () => {
      const result = createSightingSchema.safeParse({
        beerId: '123e4567-e89b-12d3-a456-426614174000',
        locationName: 'Local Pub',
        latitude: 40.7128,
        longitude: -200, // Invalid
      });
      expect(result.success).toBe(false);
    });

    it('should validate all format types', () => {
      const formats = ['DRAFT', 'CAN', 'BOTTLE', 'GROWLER', 'CROWLER'];
      for (const format of formats) {
        const result = createSightingSchema.safeParse({
          beerId: '123e4567-e89b-12d3-a456-426614174000',
          locationName: 'Local Pub',
          latitude: 40.7128,
          longitude: -74.0060,
          format,
        });
        expect(result.success).toBe(true);
      }
    });
  });
});
