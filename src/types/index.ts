import { MembershipTier } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  membershipTier: MembershipTier;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
