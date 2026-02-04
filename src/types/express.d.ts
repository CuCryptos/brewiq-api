import { MembershipTier } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      username: string;
      membershipTier: MembershipTier;
    }
  }
}

export {};
