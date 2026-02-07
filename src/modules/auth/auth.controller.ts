import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import passport from 'passport';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as authService from './auth.service.js';
import { redis } from '../../config/redis.js';
import { ApiError } from '../../utils/ApiError.js';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RefreshTokenInput,
} from './auth.schema.js';
import { config } from '../../config/index.js';

const OAUTH_CODE_EXPIRY = 60; // 60 seconds TTL for one-time codes
const OAUTH_STATE_EXPIRY = 600; // 10 minutes TTL for OAuth state

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input: RegisterInput = req.body;
  const result = await authService.register(input);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account.',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input: LoginInput = req.body;
  const result = await authService.login(input);

  res.json({
    success: true,
    data: result,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken }: RefreshTokenInput = req.body;
  const tokens = await authService.refreshTokens(refreshToken);

  res.json({
    success: true,
    data: tokens,
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const input: ForgotPasswordInput = req.body;
  await authService.forgotPassword(input);

  res.json({
    success: true,
    message: 'If an account exists with this email, you will receive a password reset link.',
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const input: ResetPasswordInput = req.body;
  await authService.resetPassword(input);

  res.json({
    success: true,
    message: 'Password reset successfully. You can now log in with your new password.',
  });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const token = req.params.token as string;
  await authService.verifyEmail(token);

  // Redirect to frontend
  res.redirect(`${config.FRONTEND_URL}/login?verified=true`);
});

export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const state = uuid();
  await redis.setex(`oauth_state:${state}`, OAUTH_STATE_EXPIRY, '1');
  passport.authenticate('google', { scope: ['profile', 'email'], state })(req, res);
});

export const githubAuth = asyncHandler(async (req: Request, res: Response) => {
  const state = uuid();
  await redis.setex(`oauth_state:${state}`, OAUTH_STATE_EXPIRY, '1');
  passport.authenticate('github', { scope: ['user:email'], state })(req, res);
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const state = req.query.state as string | undefined;
  if (!state) {
    throw ApiError.badRequest('Invalid OAuth state - possible CSRF attack');
  }
  const stateKey = `oauth_state:${state}`;
  const valid = await redis.get(stateKey);
  if (!valid) {
    throw ApiError.badRequest('Invalid OAuth state - possible CSRF attack');
  }
  await redis.del(stateKey);

  const user = req.user as any;
  const result = await authService.findOrCreateOAuthUser('google', {
    id: user.id,
    email: user.emails[0].value,
    displayName: user.displayName,
    avatarUrl: user.photos?.[0]?.value,
  });

  // Store tokens in Redis under a one-time code (never expose tokens in URLs)
  const code = uuid();
  await redis.setex(
    `oauth_code:${code}`,
    OAUTH_CODE_EXPIRY,
    JSON.stringify({ accessToken: result.accessToken, refreshToken: result.refreshToken, user: result.user }),
  );

  const params = new URLSearchParams({ code, provider: 'google' });
  res.redirect(`${config.FRONTEND_URL}/auth/callback?${params}`);
});

export const githubCallback = asyncHandler(async (req: Request, res: Response) => {
  const state = req.query.state as string | undefined;
  if (!state) {
    throw ApiError.badRequest('Invalid OAuth state - possible CSRF attack');
  }
  const stateKey = `oauth_state:${state}`;
  const valid = await redis.get(stateKey);
  if (!valid) {
    throw ApiError.badRequest('Invalid OAuth state - possible CSRF attack');
  }
  await redis.del(stateKey);

  const user = req.user as any;
  const result = await authService.findOrCreateOAuthUser('github', {
    id: user.id,
    email: user.emails?.[0]?.value || `github-${user.id}@users.noreply.brewiq.ai`,
    displayName: user.displayName || user.username,
    avatarUrl: user.photos?.[0]?.value,
  });

  // Store tokens in Redis under a one-time code (never expose tokens in URLs)
  const code = uuid();
  await redis.setex(
    `oauth_code:${code}`,
    OAUTH_CODE_EXPIRY,
    JSON.stringify({ accessToken: result.accessToken, refreshToken: result.refreshToken, user: result.user }),
  );

  const params = new URLSearchParams({ code, provider: 'github' });
  res.redirect(`${config.FRONTEND_URL}/auth/callback?${params}`);
});

export const exchangeOAuthCode = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    throw ApiError.badRequest('Authorization code is required', 'MISSING_CODE');
  }

  const key = `oauth_code:${code}`;
  const stored = await redis.get(key);

  if (!stored) {
    throw ApiError.unauthorized('Invalid or expired authorization code', 'INVALID_OAUTH_CODE');
  }

  // Delete immediately — one-time use only
  await redis.del(key);

  const data = JSON.parse(stored);

  res.json({
    success: true,
    data,
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: req.user,
  });
});
