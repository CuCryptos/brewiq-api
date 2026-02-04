import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

import { config } from './config/index.js';
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

  // Socket.IO setup
  const io = new SocketServer(httpServer, {
    cors: {
      origin: config.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Trust proxy for Railway
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, res, next) => {
    logger.http(`${req.method} ${req.originalUrl}`);
    next();
  });

  // Health check (before rate limiter)
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
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

  // Stripe webhook (raw body needed)
  app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return { app, io, httpServer };
}
