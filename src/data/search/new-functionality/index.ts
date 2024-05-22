import { platformFindParams } from '../platform';
import { userFindParams } from '../user';
import type { Prisma } from '@prisma/client';

export const newFunctionalityFindParams: Prisma.NewFunctionalitySelect = {
  createdAt: true,
  description: true,
  finishedAt: true,
  id: true,
  name: true,
  platform: {
    select: platformFindParams
  },
  updatedAt: true,
  user: {
    select: userFindParams
  },
  wasRaised: true
};
