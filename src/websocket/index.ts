import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import type { JwtPayload } from '../middleware/auth.js';

let io: SocketServer | null = null;

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userLocation?: { lat: number; lng: number };
}

export function setupWebSocket(socketServer: SocketServer): void {
  io = socketServer;

  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      // Allow anonymous connections for public sighting feed
      return next();
    }

    try {
      const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      socket.userId = payload.userId;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`Socket connected: ${socket.id} (user: ${socket.userId || 'anonymous'})`);

    // Join user-specific room if authenticated
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Subscribe to location-based sighting updates
    socket.on('subscribe:location', (data: { lat: number; lng: number; radius?: number }) => {
      socket.userLocation = { lat: data.lat, lng: data.lng };

      // Join a grid-based room for location (rough approximation)
      const gridLat = Math.floor(data.lat);
      const gridLng = Math.floor(data.lng);
      socket.join(`location:${gridLat}:${gridLng}`);

      logger.debug(`Socket ${socket.id} subscribed to location ${gridLat},${gridLng}`);
    });

    // Subscribe to specific beer sightings
    socket.on('subscribe:beer', (beerId: string) => {
      socket.join(`beer:${beerId}`);
      logger.debug(`Socket ${socket.id} subscribed to beer ${beerId}`);
    });

    // Unsubscribe from beer
    socket.on('unsubscribe:beer', (beerId: string) => {
      socket.leave(`beer:${beerId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('✅ WebSocket server configured');
}

// Emit a new sighting to relevant subscribers
export function notifyBeerSighting(sighting: {
  id: string;
  beerId: string;
  beer: { id: string; name: string; slug: string; imageUrl: string | null };
  locationName: string;
  latitude: number;
  longitude: number;
  format: string;
  price?: number | null;
  user: { username: string; displayName: string | null };
}): void {
  if (!io) return;

  const event = {
    type: 'new_sighting',
    data: sighting,
  };

  // Emit to beer-specific subscribers
  io.to(`beer:${sighting.beerId}`).emit('sighting', event);

  // Emit to location-based subscribers
  const gridLat = Math.floor(sighting.latitude);
  const gridLng = Math.floor(sighting.longitude);
  io.to(`location:${gridLat}:${gridLng}`).emit('sighting', event);

  logger.debug(`Sighting notification emitted for beer ${sighting.beer.name}`);
}

// Send notification to specific user
export function notifyUser(userId: string, notification: {
  type: string;
  title: string;
  message: string;
  data?: object;
}): void {
  if (!io) return;

  io.to(`user:${userId}`).emit('notification', notification);
}

// Broadcast achievement unlocked
export function notifyAchievement(userId: string, achievement: {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  pointsAwarded: number;
}): void {
  if (!io) return;

  io.to(`user:${userId}`).emit('achievement', {
    type: 'achievement_unlocked',
    data: achievement,
  });
}
