import { describe, it, expect } from 'vitest';
import { ApiError } from '../utils/ApiError.js';
import { paginate, getSkip } from '../utils/pagination.js';

describe('ApiError', () => {
  it('should create a bad request error', () => {
    const error = ApiError.badRequest('Invalid input', 'INVALID_INPUT');
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Invalid input');
    expect(error.code).toBe('INVALID_INPUT');
    expect(error.isOperational).toBe(true);
  });

  it('should create an unauthorized error', () => {
    const error = ApiError.unauthorized('Not authenticated');
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Not authenticated');
  });

  it('should create a not found error', () => {
    const error = ApiError.notFound('Beer not found');
    expect(error.statusCode).toBe(404);
  });

  it('should create a conflict error', () => {
    const error = ApiError.conflict('Email already exists');
    expect(error.statusCode).toBe(409);
  });

  it('should create a rate limit error', () => {
    const error = ApiError.tooManyRequests();
    expect(error.statusCode).toBe(429);
  });

  it('should create an internal error', () => {
    const error = ApiError.internal('Something went wrong');
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(false);
  });
});

describe('Pagination', () => {
  it('should calculate skip correctly', () => {
    expect(getSkip({ page: 1, limit: 20, sortOrder: 'desc' })).toBe(0);
    expect(getSkip({ page: 2, limit: 20, sortOrder: 'desc' })).toBe(20);
    expect(getSkip({ page: 3, limit: 10, sortOrder: 'desc' })).toBe(20);
  });

  it('should paginate results correctly', () => {
    const data = [1, 2, 3, 4, 5];
    const result = paginate(data, 50, { page: 1, limit: 5, sortOrder: 'desc' });

    expect(result.data).toEqual(data);
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(5);
    expect(result.meta.total).toBe(50);
    expect(result.meta.totalPages).toBe(10);
    expect(result.meta.hasNext).toBe(true);
    expect(result.meta.hasPrev).toBe(false);
  });

  it('should handle last page correctly', () => {
    const data = [1, 2];
    const result = paginate(data, 12, { page: 3, limit: 5, sortOrder: 'desc' });

    expect(result.meta.hasNext).toBe(false);
    expect(result.meta.hasPrev).toBe(true);
    expect(result.meta.totalPages).toBe(3);
  });
});
