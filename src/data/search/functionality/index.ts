/* eslint-disable no-undefined */
import { inputPropsFindParams } from '../input-props';
import { platformFindParams } from '../platform';
import type { Prisma } from '@prisma/client';

export const functionalityFindParams = (hasInputProps: boolean): Prisma.FunctionalitySelect => ({
  apiRoute: true,
  createdAt: true,
  description: true,
  finishedAt: true,
  id: true,
  inputProps: hasInputProps
    ? {
        select: inputPropsFindParams
      }
    : undefined,
  keyword: true,
  name: true,
  platform: {
    select: platformFindParams
  },
  updatedAt: true
});
