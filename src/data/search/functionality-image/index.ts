import type { Prisma } from '@prisma/client';

export const functionalityImageFindParams: Prisma.FunctionalityImageSelect = {
  active: true,
  createdAt: true,
  finishedAt: true,
  functionalityId: true,
  id: true,
  imagesOnFunctionality: {
    select: {
      createdAt: true,
      finishedAt: true,
      id: true,
      inputOnImage: true,
      updatedAt: true,
      url: true
    },
    where: {
      finishedAt: null
    }
  },
  updatedAt: true
};
