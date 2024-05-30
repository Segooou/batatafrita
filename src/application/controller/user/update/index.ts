/* eslint-disable max-statements */
/* eslint-disable no-undefined */
import { ValidationError } from 'yup';

import { DataSource } from '../../../../infra/database';
import { Role } from '@prisma/client';
import {
  badRequest,
  errorLogger,
  forbidden,
  messageErrorResponse,
  ok,
  validationErrorResponse,
  whereById
} from '../../../../main/utils';
import { env } from '../../../../main/config/env';
import { hasUserByUsername } from '../../../helper';
import { hash } from 'bcrypt';
import { messages } from '../../../../domain/helpers';
import { updateUserSchema } from '../../../../data/validation';
import { userFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  password?: string;
  username?: string;
  avatar?: string;
}

/**
 * @typedef {object} UpdateUserBody
 * @property {string} username
 * @property {string} password
 * @property {string} avatar
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
 * @param {UpdateUserBody} request.body - user info - multipart/form-data
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

      if (request.user.id !== Number(request.params.id) && request.user.role !== Role.admin)
        return forbidden({
          message: { english: 'update this user', portuguese: 'atualizar este usuário' },
          response
        });

      const { username, password, avatar } = request.body as Body;

      if (await hasUserByUsername(username, Number(request.params.id)))
        return badRequest({ message: messages.default.userAlreadyExists, response });

      let newPassword: string | undefined;

      if (typeof password === 'string' && password.length > 0) {
        const { HASH_SALT } = env;

        const hashedPassword = await hash(password, HASH_SALT);

        newPassword = hashedPassword;
      }

      const payload = await DataSource.user.update({
        data: {
          avatar,
          password: newPassword,
          username
        },
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
