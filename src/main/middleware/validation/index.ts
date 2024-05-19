import { DataSource } from '../../../infra/database';
import { env } from '../../config/env';
import { errorLogger, removeBearer, unauthorized } from '../../utils';
import { userFindParams } from '../../../data/search';
import { verify } from 'jsonwebtoken';
import type { Controller } from '../../../domain/protocols';
import type { NextFunction, Request, Response } from 'express';
import type { tokenInput } from '../../../domain/token';

export const validateTokenMiddleware: Controller =
  // eslint-disable-next-line consistent-return
  () => async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { authorization } = request.headers;

      if (typeof authorization === 'undefined') return unauthorized({ response });

      const accessToken = removeBearer(authorization);

      if (accessToken === null) return unauthorized({ response });

      const { SECRET } = env.JWT;
      const { user } = verify(accessToken, SECRET) as { user: tokenInput };

      if (typeof user.id === 'undefined' || typeof user.email === 'undefined')
        return unauthorized({ response });

      const account = await DataSource.user.findFirst({
        select: userFindParams,
        where: {
          AND: {
            ...user,
            finishedAt: null
          }
        }
      });

      if (account === null) return unauthorized({ response });

      Object.assign(request, { user: account });
      next();
    } catch (error) {
      errorLogger(error);

      return unauthorized({ response });
    }
  };
