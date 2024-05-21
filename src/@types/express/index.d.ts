import type { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user: Pick<User, 'createdAt' | 'finishedAt' | 'id' | 'role' | 'updatedAt' | 'username'>;
    }
  }
}
