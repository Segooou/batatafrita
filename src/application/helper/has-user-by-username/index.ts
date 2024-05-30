import { DataSource } from '../../../infra/database';

export const hasUserByUsername = async (username?: string, id?: number): Promise<boolean> => {
  if (typeof username !== 'string') return false;

  const user = await DataSource.user.findFirst({
    select: { id: true },
    where: { AND: { finishedAt: null, username } }
  });

  if (user === null || user.id === id) return false;

  return true;
};
