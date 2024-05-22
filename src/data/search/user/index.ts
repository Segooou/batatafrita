import type { Prisma } from '@prisma/client';

export const userFindParams: Prisma.UserSelect = {
  avatar: true,
  createdAt: true,
  finishedAt: true,
  id: true,
  role: true,
  updatedAt: true,
  username: true
};
