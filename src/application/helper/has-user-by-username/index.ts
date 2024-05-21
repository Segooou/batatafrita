import { DataSource } from '../../../infra/database';

export const hasUserByUsername = async (username?: string): Promise<boolean> => {
  if (typeof username !== 'string') return false;

  const user = await DataSource.user.findFirst({
    select: { id: true },
    where: { AND: { finishedAt: null, username } }
  });

  if (user === null) return false;

  return true;
};
