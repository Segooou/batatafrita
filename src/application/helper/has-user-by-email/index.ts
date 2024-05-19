import { DataSource } from '../../../infra/database';

export const hasUserByEmail = async (email?: string): Promise<boolean> => {
  if (typeof email !== 'string') return false;

  const user = await DataSource.user.findFirst({
    select: { id: true },
    where: { AND: { email, finishedAt: null } }
  });

  if (user === null) return false;

  return true;
};
