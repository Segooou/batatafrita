import { DataSource } from '../../../../infra/database';
import { errorLogger, messageErrorResponse, ok } from '../../../../main/utils';
import { platformFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} DeletePlatformResponse
 * @property {Messages} message
 * @property {string} status
 */

/**
 * DELETE /platform/{id}
 * @summary Delete Platform
 * @tags Platform
 * @security BearerAuth
 * @param {number} id.path.required
 * @return {DeletePlatformResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deletePlatformController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await DataSource.platform.update({
        data: {
          finishedAt: new Date(),
          functionalities: {
            updateMany: {
              data: { finishedAt: new Date() },
              where: { platformId: Number(request.params.id) }
            }
          }
        },
        select: platformFindParams,
        where: { id: Number(request.params.id) }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({
        entity: { english: 'Platform', portuguese: 'Plataforma' },
        error,
        response
      });
    }
  };
