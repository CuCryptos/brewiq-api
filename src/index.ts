import { config } from './config/index.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { disconnectRedis } from './config/redis.js';
import { createApp } from './server.js';
import { logger } from './utils/logger.js';
import { setupWebSocket } from './websocket/index.js';

async function bootstrap() {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const { app, io, httpServer } = createApp();

    // Setup WebSocket handlers
    setupWebSocket(io);

    // Start server
    httpServer.listen(config.PORT, () => {
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
