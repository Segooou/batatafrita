import { DataSource } from '../../../../infra/database';
import { ValidationError } from 'yup';
import {
  errorLogger,
  messageErrorResponse,
  normalizeText,
  ok,
  validationErrorResponse
} from '../../../../main/utils';
import { insertPlatformSchema } from '../../../../data/validation';
import { platformFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  image: string;
  description?: string;
}

/**
 * @typedef {object} InsertPlatformBody
 * @property {string} name.required
 * @property {string} description
 * @property {string} image.required
 */

/**
 * @typedef {object} InsertPlatformResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Platform} payload
 */

/**
 * POST /platform
 * @summary Insert Platform
 * @tags Platform
 * @security BearerAuth
 * @param {InsertPlatformBody} request.body.required
 * @return {InsertPlatformResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertPlatformController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await insertPlatformSchema.validate(request, { abortEarly: false });

      const { image, name, description } = request.body as Body;

      const payload = await DataSource.platform.create({
        data: { description, image, keyword: normalizeText(name), name },
        select: platformFindParams
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
