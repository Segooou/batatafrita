import { DataSource } from '../../../../infra/database';
import { ValidationError } from 'yup';
import {
  errorLogger,
  messageErrorResponse,
  ok,
  validationErrorResponse
} from '../../../../main/utils';
import { insertNewFunctionalitySchema } from '../../../../data/validation';
import { newFunctionalityFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  description: string;
  platformId: number;
}

/**
 * @typedef {object} InsertNewFunctionalityBody
 * @property {string} name.required
 * @property {string} description.required
 * @property {number} platformId.required
 */

/**
 * @typedef {object} InsertNewFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 * @property {NewFunctionality} payload
 */

/**
 * POST /new-functionality
 * @summary Insert NewFunctionality
 * @tags NewFunctionality
 * @security BearerAuth
 * @param {InsertNewFunctionalityBody} request.body.required
 * @return {InsertNewFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertNewFunctionalityController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await insertNewFunctionalitySchema.validate(request, { abortEarly: false });

      const { platformId, name, description } = request.body as Body;

      const payload = await DataSource.newFunctionality.create({
        data: { description, name, platformId, userId: request.user.id },
        select: newFunctionalityFindParams
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
