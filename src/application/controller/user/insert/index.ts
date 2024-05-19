import { DataSource } from '../../../../infra/database';
import { ValidationError } from 'yup';
import {
  badRequest,
  errorLogger,
  messageErrorResponse,
  ok,
  validationErrorResponse
} from '../../../../main/utils';
import { env } from 'process';
import { hasUserByEmail } from '../../../helper';
import { hash } from 'bcrypt';
import { insertUserSchema } from '../../../../data/validation';
import { messages } from '../../../../domain/helpers';
import { userFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  email: string;
  password: string;
}

/**
 * @typedef {object} InsertUserBody
 * @property {string} email.required
 * @property {string} password.required
 */

/**
 * @typedef {object} InsertUserResponse
 * @property {Messages} message
 * @property {string} status
 * @property {User} payload
 */

/**
 * POST /user
 * @summary Insert User
 * @tags User
 * @example request - payload example
 * {
 *   "email": "admin@admin",
 *   "password": "123456"
 * }
 * @param {InsertUserBody} request.body.required
 * @return {InsertUserResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await insertUserSchema.validate(request, { abortEarly: false });

      const { email, password } = request.body as Body;

      if (await hasUserByEmail(email))
        return badRequest({ message: messages.default.userAlreadyExists, response });

      const { HASH_SALT } = env;

      const hashedPassword = await hash(password, Number(HASH_SALT));

      const payload = await DataSource.user.create({
        data: { email, password: hashedPassword },
        select: userFindParams
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
