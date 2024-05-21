import { DataSource } from '../../../infra/database';
import type { ActionEnum } from '@prisma/client';

interface createActionProps {
  result: string;
  hasError: boolean;
  action: ActionEnum;
  functionalityId: number;
  userId: number;
}

export const createAction = async (data: createActionProps): Promise<void> => {
  await DataSource.action.create({
    data
  });
};
