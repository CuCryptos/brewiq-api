import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as authService from './auth.service.js';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RefreshTokenInput,
} from './auth.schema.js';
import { config } from '../../config/index.js';

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

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await authService.findOrCreateOAuthUser('google', {
    id: user.id,
    email: user.emails[0].value,
    displayName: user.displayName,
    avatarUrl: user.photos?.[0]?.value,
  });

  // Redirect to frontend with tokens
  const params = new URLSearchParams({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
  res.redirect(`${config.FRONTEND_URL}/auth/callback?${params}`);
});

export const githubCallback = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await authService.findOrCreateOAuthUser('github', {
    id: user.id,
    email: user.emails?.[0]?.value || `${user.username}@github.local`,
    displayName: user.displayName || user.username,
    avatarUrl: user.photos?.[0]?.value,
  });

  // Redirect to frontend with tokens
  const params = new URLSearchParams({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
  res.redirect(`${config.FRONTEND_URL}/auth/callback?${params}`);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: req.user,
  });
});
