/* eslint-disable no-undefined */
import { ValidationError } from 'yup';

import { DataSource } from '../../../../infra/database';
import {
  errorLogger,
  messageErrorResponse,
  ok,
  validationErrorResponse,
  whereById
} from '../../../../main/utils';
import { newFunctionalityFindParams } from '../../../../data/search';
import { updateNewFunctionalitySchema } from '../../../../data/validation';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  name?: string;
  description?: string;
  platformId?: number;
  wasRaised?: boolean;
}

/**
 * @typedef {object} UpdateNewFunctionalityBody
 * @property {string} name
 * @property {string} description
 * @property {number} platformId
 * @property {boolean} wasRaised
 */

/**
 * @typedef {object} UpdateNewFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 * @property {NewFunctionality} payload
 */

/**
 * PUT /new-functionality/{id}
 * @summary Update NewFunctionality
 * @tags NewFunctionality
 * @security BearerAuth
 * @param {UpdateNewFunctionalityBody} request.body
 * @param {number} id.path.required
 * @return {UpdateNewFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateNewFunctionalityController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await updateNewFunctionalitySchema.validate(request, { abortEarly: false });

      const { description, name, platformId, wasRaised } = request.body as Body;

      const payload = await DataSource.newFunctionality.update({
        data: { description, name, platformId, wasRaised },
        select: newFunctionalityFindParams,
        where: whereById(request.params.id)
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({
        entity: { english: 'NewFunctionality', portuguese: 'Nova Funcionalidade' },
        error,
        response
      });
    }
  };
