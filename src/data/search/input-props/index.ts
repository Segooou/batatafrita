import type { Prisma } from '@prisma/client';

export const inputPropsFindParams: Prisma.InputPropsSelect = {
  createdAt: true,
  error: true,
  finishedAt: true,
  formValue: true,
  id: true,
  isRequired: true,
  label: true,
  mask: true,
  maskLength: true,
  options: true,
  placeholder: true,
  type: true,
  updatedAt: true
};
