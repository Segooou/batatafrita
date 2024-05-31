/* eslint-disable no-undefined */
import { inputPropsFindParams } from '../input-props';
import { platformFindParams } from '../platform';
import type { Prisma } from '@prisma/client';

export const functionalityFindParams = (hasInputProps: boolean): Prisma.FunctionalitySelect => ({
  active: true,
  apiRoute: true,
  createdAt: true,
  description: true,
  finishedAt: true,
  from: true,
  googleSheets: true,
  id: true,
  indexToGet: true,
  inputProps: hasInputProps
    ? {
        select: inputPropsFindParams
      }
    : undefined,
  keyword: true,
  messageNotFound: true,
  messageOnFind: true,
  name: true,
  platform: {
    select: platformFindParams
  },
  regex: true,
  subject: true,
  text: true,
  textToReplace: true,
  updatedAt: true
});
