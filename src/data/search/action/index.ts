import { functionalityFindParams } from '../functionality';
import type { Prisma } from '@prisma/client';

export const actionFindParams: Prisma.ActionSelect = {
  createdAt: true,
  data: true,
  finishedAt: true,
  functionality: {
    select: functionalityFindParams(false)
  },
  hasError: true,
  id: true,
  result: true,
  updatedAt: true
};
