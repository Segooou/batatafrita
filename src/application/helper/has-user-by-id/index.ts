import { DataSource } from '../../../infra/database';

export const hasUserById = async (id?: number): Promise<boolean> => {
  if (typeof id === 'undefined') return false;

  const user = await DataSource.user.findFirst({
    select: { id: true },
    where: { AND: { finishedAt: null, id } }
  });

  if (user === null) return false;

  return true;
};
