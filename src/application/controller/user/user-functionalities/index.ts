/* eslint-disable max-statements */
/* eslint-disable no-undefined */
import { ValidationError } from 'yup';

import { DataSource } from '../../../../infra/database';
import {
  errorLogger,
  messageErrorResponse,
  ok,
  validationErrorResponse
} from '../../../../main/utils';
import { messages } from '../../../../domain/helpers';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Functionalities {
  functionalityId: number;
  userId: number;
}

interface Platforms {
  platformId: number;
  userId: number;
}

interface Body {
  functionalities: Functionalities[];
  platforms: Platforms[];
  userId: number;
}

/**
 * PUT /user-functionalities
 * @summary Update User
 * @tags User
 * @security BearerAuth
 * @return {UpdateUserResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateUserFunctionalitiesController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { userId, functionalities, platforms } = request.body as Body;

      await DataSource.userSeeFunctionality.deleteMany({
        where: { userId }
      });
      await DataSource.userSeePlatform.deleteMany({
        where: { userId }
      });

      await DataSource.userSeeFunctionality.createMany({
        data: functionalities,
        skipDuplicates: true
      });
      await DataSource.userSeePlatform.createMany({
        data: platforms,
        skipDuplicates: true
      });

      return ok({ payload: { message: messages.default.successfullyCreated }, response });
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
