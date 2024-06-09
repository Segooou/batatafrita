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
import { messages } from '../../../../domain/helpers';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  inputOnImage: object[];
  active?: boolean;
}

/**
 * @typedef {object} InputOnImage
 * @property {boolean} inputOnImage
 */

/**
 * @typedef {object} UpdateFunctionalityImageBody
 * @property {array<InputOnImage>} inputOnImage
 */

/**
 * @typedef {object} UpdateFunctionalityImageResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Messages} payload
 */

/**
 * PUT /functionality-image/{id}
 * @summary Update Functionality image
 * @tags Functionality-image
 * @security BearerAuth
 * @param {UpdateFunctionalityImageBody} request.body
 * @param {number} id.path.required
 * @return {UpdateFunctionalityImageResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateFunctionalityImageController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { inputOnImage } = request.body as Body;

      await DataSource.imagesOnFunctionality.update({
        data: { inputOnImage },
        select: { id: true },
        where: whereById(request.params.id)
      });

      return ok({ payload: messages.default.successfullyUpdated, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({
        entity: { english: 'Functionality image', portuguese: 'Imagem da funcionalidade' },
        error,
        response
      });
    }
  };
