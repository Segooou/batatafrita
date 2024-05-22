import { DataSource } from '../../../../infra/database';
import { errorLogger, messageErrorResponse, ok } from '../../../../main/utils';
import { functionalityFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} DeleteFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 */

/**
 * DELETE /functionality/{id}
 * @summary Delete Functionality
 * @tags Functionality
 * @security BearerAuth
 * @param {number} id.path.required
 * @return {DeleteFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteFunctionalityController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await DataSource.functionality.update({
        data: {
          finishedAt: Date(),
          inputProps: {
            updateMany: {
              data: { finishedAt: Date() },
              where: { functionalityId: Number(request.params.id) }
            }
          }
        },
        select: functionalityFindParams(false),
        where: { id: Number(request.params.id) }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({
        entity: { english: 'Functionality', portuguese: 'Funcionalidade' },
        error,
        response
      });
    }
  };
