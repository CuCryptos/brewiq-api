import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { v4 as uuid } from 'uuid';

import { config } from './config/index.js';
import { redis } from './config/redis.js';
import { prisma } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { logger } from './utils/logger.js';

// Import routes
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/users.routes.js';
import beerRoutes from './modules/beers/beers.routes.js';
import breweryRoutes from './modules/breweries/breweries.routes.js';
import reviewRoutes from './modules/reviews/reviews.routes.js';
import sightingRoutes from './modules/sightings/sightings.routes.js';
import scanRoutes from './modules/scans/scans.routes.js';
import recipeRoutes from './modules/recipes/recipes.routes.js';
import achievementRoutes from './modules/achievements/achievements.routes.js';
import listRoutes from './modules/lists/lists.routes.js';
import checkinRoutes from './modules/checkins/checkins.routes.js';
import notificationRoutes from './modules/notifications/notifications.routes.js';
import leaderboardRoutes from './modules/leaderboard/leaderboard.routes.js';
import subscriptionRoutes from './modules/subscriptions/subscriptions.routes.js';

export function createApp(): { app: Express; io: SocketServer; httpServer: ReturnType<typeof createServer> } {
  const app = express();
  const httpServer = createServer(app);

  // Build allowed origins list from FRONTEND_URL + CORS_ORIGINS
  const allowedOrigins = [
    config.FRONTEND_URL,
    ...config.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
  ];

  // Socket.IO setup
  const io = new SocketServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Trust proxy for Railway
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

  // Stripe webhook must be registered BEFORE express.json() so the raw body
  // is preserved for signature verification.
  app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

  // Body parsing (skips the webhook path above since it's already handled)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request ID middleware
  app.use((req, res, next) => {
    const requestId = (req.headers['x-request-id'] as string) || uuid();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
  });

  // Request logging
  app.use((req, res, next) => {
    logger.http(`[${req.requestId}] ${req.method} ${req.originalUrl}`);
    next();
  });

  // Root route
  app.get('/', (req, res) => {
    res.json({
      name: 'BrewIQ API',
      version: '1.0.0',
      description: 'AI-powered beer discovery platform',
      endpoints: {
        health: '/health',
        auth: '/api/auth',
        beers: '/api/beers',
        breweries: '/api/breweries',
        reviews: '/api/reviews',
        scans: '/api/scans',
        docs: 'Coming soon',
      },
    });
  });

  // Health check (before rate limiter)
  app.get('/health', async (req, res) => {
    const details: { redis: string; database: string } = { redis: 'ok', database: 'ok' };
    let status = 'healthy';

    try {
      await redis.ping();
    } catch {
      details.redis = 'down';
      status = 'degraded';
    }

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      details.database = 'down';
      status = 'degraded';
    }

    res.json({
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: details,
    });
  });

  // Rate limiting
  app.use('/api', apiLimiter);

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/beers', beerRoutes);
  app.use('/api/breweries', breweryRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/sightings', sightingRoutes);
  app.use('/api/scans', scanRoutes);
  app.use('/api/recipes', recipeRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/lists', listRoutes);
  app.use('/api/checkins', checkinRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);
  app.use('/api/subscriptions', subscriptionRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return { app, io, httpServer };
}
