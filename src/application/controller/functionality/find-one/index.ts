import { DataSource } from '../../../../infra/database';
import { errorLogger, messageErrorResponse, notFound, ok } from '../../../../main/utils';
import { functionalityFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Functionality} payload
 */

/**
 * GET /functionality/{id}
 * @summary Find one Functionality
 * @tags Functionality
 * @security BearerAuth
 * @param {number} id.path.required
 * @return {FindOneFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneFunctionalityController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await DataSource.functionality.findUnique({
        select: functionalityFindParams(true),
        where: { id: Number(request.params.id) }
      });

      if (payload === null)
        return notFound({
          entity: { english: 'Functionality', portuguese: 'Funcionalidade' },
          response
        });

      return ok({
        payload,
        response
      });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
