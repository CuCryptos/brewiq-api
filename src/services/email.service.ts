import { Resend } from 'resend';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

const resend = config.RESEND_API_KEY ? new Resend(config.RESEND_API_KEY) : null;

export const emailService = {
  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verifyUrl = `${config.FRONTEND_URL}/api/auth/verify-email/${token}`;

    await this.send({
      to,
      subject: 'Verify your BrewIQ account',
      html: `
        <h1>Welcome to BrewIQ!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #F59E0B; color: white; text-decoration: none; border-radius: 6px;">Verify Email</a>
        <p>If you didn't create this account, you can safely ignore this email.</p>
        <p>Cheers,<br>The BrewIQ Team</p>
      `,
    });
  },

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;

    await this.send({
      to,
      subject: 'Reset your BrewIQ password',
      html: `
        <h1>Reset Your Password</h1>
        <p>You requested a password reset for your BrewIQ account.</p>
        <p>Click the link below to reset your password (valid for 1 hour):</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #F59E0B; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Cheers,<br>The BrewIQ Team</p>
      `,
    });
  },

  async sendBeerSightingAlert(to: string, beerName: string, location: string): Promise<void> {
    await this.send({
      to,
      subject: `🍺 ${beerName} spotted near you!`,
      html: `
        <h1>Beer Alert!</h1>
        <p><strong>${beerName}</strong> was just spotted at:</p>
        <p style="font-size: 18px; color: #F59E0B;">${location}</p>
        <a href="${config.FRONTEND_URL}/sightings" style="display: inline-block; padding: 12px 24px; background-color: #F59E0B; color: white; text-decoration: none; border-radius: 6px;">View Sighting</a>
        <p>Happy hunting!<br>The BrewIQ Team</p>
      `,
    });
  },

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    await this.send({
      to,
      subject: 'Welcome to BrewIQ! 🍺',
      html: `
        <h1>Welcome to BrewIQ, ${username}!</h1>
        <p>Thanks for joining the smartest beer community on the planet.</p>
        <h2>Get Started:</h2>
        <ul>
          <li>📸 <strong>Scan a beer</strong> - Point your camera at any beer to get instant insights</li>
          <li>⭐ <strong>Rate & Review</strong> - Share your tasting notes with the community</li>
          <li>📍 <strong>Spot beers</strong> - Help others find craft beers in your area</li>
          <li>🏆 <strong>Earn achievements</strong> - Level up as you explore</li>
        </ul>
        <a href="${config.FRONTEND_URL}" style="display: inline-block; padding: 12px 24px; background-color: #F59E0B; color: white; text-decoration: none; border-radius: 6px;">Start Exploring</a>
        <p>Cheers,<br>The BrewIQ Team</p>
      `,
    });
  },

  async send({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
    if (!resend) {
      logger.warn(`Email not sent (no API key): ${subject} to ${to}`);
      return;
    }

    try {
      await resend.emails.send({
        from: config.EMAIL_FROM,
        to,
        subject,
        html,
      });
      logger.info(`Email sent: ${subject} to ${to}`);
    } catch (error) {
      logger.error(`Failed to send email: ${error}`);
      throw error;
    }
  },
};
