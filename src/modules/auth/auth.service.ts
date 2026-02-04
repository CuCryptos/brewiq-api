import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../middleware/auth.js';
import { emailService } from '../../services/email.service.js';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './auth.schema.js';

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    membershipTier: string;
    points: number;
    level: number;
  };
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  // Check if email exists
  const existingEmail = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });
  if (existingEmail) {
    throw ApiError.conflict('Email already registered', 'EMAIL_EXISTS');
  }

  // Check if username exists
  const existingUsername = await prisma.user.findUnique({
    where: { username: input.username.toLowerCase() },
  });
  if (existingUsername) {
    throw ApiError.conflict('Username already taken', 'USERNAME_EXISTS');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  // Generate verification token
  const verifyToken = uuid();

  // Create user
  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      username: input.username.toLowerCase(),
      displayName: input.displayName || input.username,
      passwordHash,
      verifyToken,
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      membershipTier: true,
      points: true,
      level: true,
    },
  });

  // Send verification email
  await emailService.sendVerificationEmail(user.email, verifyToken);

  // Generate tokens
  const tokens = await generateTokens(user.id, user.email);

  return { ...tokens, user };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      membershipTier: true,
      points: true,
      level: true,
      passwordHash: true,
    },
  });

  if (!user || !user.passwordHash) {
    throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  // Verify password
  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate tokens
  const { passwordHash: _, ...userWithoutPassword } = user;
  const tokens = await generateTokens(user.id, user.email);

  return { ...tokens, user: userWithoutPassword };
}

export async function logout(refreshToken: string): Promise<void> {
  // Invalidate refresh token in Redis
  await redis.del(`refresh:${refreshToken}`);
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  // Verify token is valid
  const payload = verifyRefreshToken(refreshToken);

  // Check if token exists in Redis (not revoked)
  const exists = await redis.exists(`refresh:${refreshToken}`);
  if (!exists) {
    throw ApiError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
  }

  // Revoke old token
  await redis.del(`refresh:${refreshToken}`);

  // Generate new tokens
  return generateTokens(payload.userId, payload.email);
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  // Don't reveal if email exists
  if (!user) {
    return;
  }

  // Generate reset token
  const resetToken = uuid();
  const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExp },
  });

  // Send reset email
  await emailService.sendPasswordResetEmail(user.email, resetToken);
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: input.token,
      resetTokenExp: { gt: new Date() },
    },
  });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token', 'INVALID_RESET_TOKEN');
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  // Update user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExp: null,
    },
  });
}

export async function verifyEmail(token: string): Promise<void> {
  const user = await prisma.user.findFirst({
    where: { verifyToken: token },
  });

  if (!user) {
    throw ApiError.badRequest('Invalid verification token', 'INVALID_VERIFY_TOKEN');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verifyToken: null,
    },
  });
}

export async function findOrCreateOAuthUser(
  provider: 'google' | 'github',
  profile: {
    id: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
  },
): Promise<AuthResponse> {
  const providerId = provider === 'google' ? 'googleId' : 'githubId';

  // Find by provider ID
  let user = await prisma.user.findFirst({
    where: { [providerId]: profile.id },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      membershipTier: true,
      points: true,
      level: true,
    },
  });

  if (!user) {
    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email.toLowerCase() },
    });

    if (existingUser) {
      // Link OAuth to existing account
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: { [providerId]: profile.id },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          membershipTier: true,
          points: true,
          level: true,
        },
      });
    } else {
      // Create new user
      const username = await generateUniqueUsername(profile.displayName || profile.email.split('@')[0]);

      user = await prisma.user.create({
        data: {
          email: profile.email.toLowerCase(),
          username,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          [providerId]: profile.id,
          isVerified: true,
        },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          membershipTier: true,
          points: true,
          level: true,
        },
      });
    }
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = await generateTokens(user.id, user.email);

  return { ...tokens, user };
}

async function generateTokens(userId: string, email: string): Promise<AuthTokens> {
  const accessToken = generateAccessToken({ userId, email });
  const refreshToken = generateRefreshToken({ userId, email });

  // Store refresh token in Redis
  await redis.setex(`refresh:${refreshToken}`, REFRESH_TOKEN_EXPIRY, userId);

  return { accessToken, refreshToken };
}

async function generateUniqueUsername(base: string): Promise<string> {
  const sanitized = base.toLowerCase().replace(/[^a-z0-9]/g, '');
  let username = sanitized.slice(0, 20);
  let counter = 0;

  while (true) {
    const candidate = counter === 0 ? username : `${username}${counter}`;
    const exists = await prisma.user.findUnique({
      where: { username: candidate },
    });
    if (!exists) {
      return candidate;
    }
    counter++;
  }
}
