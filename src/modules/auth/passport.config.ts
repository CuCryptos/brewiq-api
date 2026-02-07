import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

export function setupPassport() {
  // Google Strategy
  if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.GOOGLE_CLIENT_ID,
          clientSecret: config.GOOGLE_CLIENT_SECRET,
          callbackURL: config.GOOGLE_CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
          done(null, profile as any);
        },
      ),
    );
    logger.info('Google OAuth configured');
  }

  // GitHub Strategy
  if (config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: config.GITHUB_CLIENT_ID,
          clientSecret: config.GITHUB_CLIENT_SECRET,
          callbackURL: config.GITHUB_CALLBACK_URL,
        },
        (
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: (err: any, user?: any) => void,
        ) => {
          done(null, profile);
        },
      ),
    );
    logger.info('GitHub OAuth configured');
  }

  // Serialization (not used with JWT, but required by passport)
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
}
