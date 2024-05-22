import { DataSource } from '../../../../infra/database';
import { errorLogger, messageErrorResponse, ok } from '../../../../main/utils';
import { newFunctionalityFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} DeleteNewFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 */

/**
 * DELETE /new-functionality/{id}
 * @summary Delete NewFunctionality
 * @tags NewFunctionality
 * @security BearerAuth
 * @param {number} id.path.required
 * @return {DeleteNewFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteNewFunctionalityController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await DataSource.newFunctionality.update({
        data: {
          finishedAt: new Date()
        },
        select: newFunctionalityFindParams,
        where: { id: Number(request.params.id) }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({
        entity: { english: 'NewFunctionality', portuguese: 'Nova Funcionalidade' },
        error,
        response
      });
    }
  };
