import type { Prisma } from '@prisma/client';

export const platformFindParams: Prisma.PlatformSelect = {
  createdAt: true,
  description: true,
  finishedAt: true,
  id: true,
  image: true,
  keyword: true,
  name: true,
  updatedAt: true
};
