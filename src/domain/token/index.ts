import type { Role } from '@prisma/client';

export interface tokenInput {
  id: number;
  username: string;
  role: Role;
}
