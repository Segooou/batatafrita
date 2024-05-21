import { DataSource } from '../../../../infra/database';
import { errorLogger, messageErrorResponse, notFound, ok } from '../../../../main/utils';
import { newFunctionalityFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneNewFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 * @property {NewFunctionality} payload
 */

/**
 * GET /new-functionality/{id}
 * @summary Find one NewFunctionality
 * @tags NewFunctionality
 * @security BearerAuth
 * @param {number} id.path.required
 * @return {FindOneNewFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneNewFunctionalityController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await DataSource.newFunctionality.findUnique({
        select: newFunctionalityFindParams,
        where: { id: Number(request.params.id) }
      });

      if (payload === null)
        return notFound({
          entity: { english: 'NewFunctionality', portuguese: 'Nova Funcionalidade' },
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
