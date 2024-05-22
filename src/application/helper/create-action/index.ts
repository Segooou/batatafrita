import { DataSource } from '../../../infra/database';

interface createActionProps {
  data: object;
  result: string[];
  hasError: boolean;
  functionalityId: number;
  userId: number;
}

export const createAction = async (data: createActionProps): Promise<void> => {
  await DataSource.action.create({
    data
  });
};
