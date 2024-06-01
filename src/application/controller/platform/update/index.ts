/* eslint-disable no-undefined */
import { ValidationError } from 'yup';

import { DataSource } from '../../../../infra/database';
import {
  errorLogger,
  messageErrorResponse,
  normalizeText,
  ok,
  validationErrorResponse,
  whereById
} from '../../../../main/utils';
import { platformFindParams } from '../../../../data/search';
import { updatePlatformSchema } from '../../../../data/validation';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  name?: string;
  image?: string;
  description?: string;
}

/**
 * @typedef {object} UpdatePlatformBody
 * @property {string} name
 * @property {string} description
 * @property {string} image
 */

/**
 * @typedef {object} UpdatePlatformResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Platform} payload
 */

/**
 * PUT /platform/{id}
 * @summary Update Platform
 * @tags Platform
 * @security BearerAuth
 * @param {UpdatePlatformBody} request.body
 * @param {number} id.path.required
 * @return {UpdatePlatformResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updatePlatformController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await updatePlatformSchema.validate(request, { abortEarly: false });

      const body = request.body as Body;

      let keyword: string | undefined;
      let name: string | undefined;

      if (typeof body.name === 'string') {
        name = body.name;
        keyword = normalizeText(body.name);
      }

      const { image } = body;

      let description: string | undefined;

      if (typeof request.file?.filename === 'string') description = body.description;

      const payload = await DataSource.platform.update({
        data: { description, image, keyword, name },
        select: platformFindParams,
        where: whereById(request.params.id)
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({
        entity: { english: 'Platform', portuguese: 'Plataforma' },
        error,
        response
      });
    }
  };
