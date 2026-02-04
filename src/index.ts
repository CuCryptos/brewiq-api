console.log('Starting BrewIQ API...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('REDIS_URL exists:', !!process.env.REDIS_URL);
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);

import { config } from './config/index.js';
console.log('Config loaded successfully');

import { connectDatabase, disconnectDatabase } from './config/database.js';
import { disconnectRedis } from './config/redis.js';
import { createApp } from './server.js';
import { logger } from './utils/logger.js';
import { setupWebSocket } from './websocket/index.js';

async function bootstrap() {
  try {
    console.log('Connecting to database...');
    // Connect to database
    await connectDatabase();
    console.log('Database connected!');

    // Create Express app
    const { app, io, httpServer } = createApp();
    console.log('Express app created');

    // Setup WebSocket handlers
    setupWebSocket(io);
    console.log('WebSocket setup complete');

    // Start server
    httpServer.listen(config.PORT, () => {
      console.log(`Server listening on port ${config.PORT}`);
      logger.info(`🍺 BrewIQ API running on port ${config.PORT}`);
      logger.info(`📍 Environment: ${config.NODE_ENV}`);
      logger.info(`🔗 Frontend URL: ${config.FRONTEND_URL}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      httpServer.close(async () => {
        await disconnectDatabase();
        await disconnectRedis();
        logger.info('Server closed');
        process.exit(0);
      });

      // Force exit after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
