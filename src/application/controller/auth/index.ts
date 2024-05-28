import { DataSource } from '../../../infra/database';
import { ValidationError } from 'yup';
import { authenticateSchema } from '../../../data/validation';
import {
  badRequest,
  errorLogger,
  generateToken,
  messageErrorResponse,
  ok,
  validationErrorResponse
} from '../../../main/utils';
import { compare } from 'bcrypt';
import { messages } from '../../../domain/helpers';
import { userFindParams } from '../../../data/search';
import type { Controller } from '../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  username: string;
  password: string;
}

/**
 * @typedef {object} LoginBody
 * @property {string} username.required
 * @property {string} password.required
 */

/**
 * @typedef {object} LoginPayload
 * @property {string} accessToken.required
 * @property {User} user.required
 */

/**
 * @typedef {object} LoginResponse
 * @property {Messages} message
 * @property {string} status
 * @property {LoginPayload} payload
 */

/**
 * POST /login
 * @summary Login
 * @tags A Auth
 * @example request - payload example
 * {
 *   "username": "segou",
 *   "password": "123456"
 * }
 * @param {LoginBody} request.body.required - application/json
 * @return {LoginResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const authenticateUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await authenticateSchema.validate(request, { abortEarly: false });

      const { username, password } = request.body as Body;

      const user = await DataSource.user.findFirst({
        select: { ...userFindParams, password: true },
        where: { AND: { finishedAt: null, username } }
      });

      if (user === null) return badRequest({ message: messages.auth.notFound, response });

      const passwordIsCorrect = await compare(password, user.password);

      if (!passwordIsCorrect) return badRequest({ message: messages.auth.notFound, response });

      const { accessToken } = generateToken({
        id: user.id,
        role: user.role,
        username: user.username
      });

      return ok({
        payload: {
          accessToken,
          user: {
            avatar: user.avatar,
            createdAt: user.createdAt,
            id: user.id,
            role: user.role,
            updatedAt: user.updatedAt,
            username: user.username
          }
        },
        response
      });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
