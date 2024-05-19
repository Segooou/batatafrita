import { ValidationError } from 'yup';

import { DataSource } from '../../../../infra/database';
import {
  badRequest,
  errorLogger,
  forbidden,
  messageErrorResponse,
  ok,
  validationErrorResponse,
  whereById
} from '../../../../main/utils';
import { env } from 'process';
import { hasUserByEmail } from '../../../helper';
import { hash } from 'bcrypt';
import { messages } from '../../../../domain/helpers';
import { updateUserSchema } from '../../../../data/validation';
import { userFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  password?: string;
  email?: string;
}

/**
 * @typedef {object} UpdateUserBody
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {object} UpdateUserResponse
 * @property {Messages} message
 * @property {string} status
 * @property {User} payload
 */

/**
 * PUT /user/{id}
 * @summary Update User
 * @tags User
 * @security BearerAuth
 * @param {UpdateUserBody} request.body
 * @param {number} id.path.required
 * @return {UpdateUserResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await updateUserSchema.validate(request, { abortEarly: false });

      if (request.user.id !== Number(request.params.id))
        return forbidden({
          message: { english: 'update this user', portuguese: 'atualizar este usuário' },
          response
        });

      const { email, password } = request.body as Body;

      if (await hasUserByEmail(email))
        return badRequest({ message: messages.default.userAlreadyExists, response });

      let newPassword: string | undefined;

      if (typeof password === 'string') {
        const { HASH_SALT } = env;

        const hashedPassword = await hash(password, Number(HASH_SALT));

        newPassword = hashedPassword;
      }
      const payload = await DataSource.user.update({
        data: { email, password: newPassword },
        select: userFindParams,
        where: whereById(request.params.id)
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({
        entity: { english: 'User', portuguese: 'Usuário' },
        error,
        response
      });
    }
  };
