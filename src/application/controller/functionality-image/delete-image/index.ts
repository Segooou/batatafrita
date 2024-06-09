import { DataSource } from '../../../../infra/database';
import { errorLogger, messageErrorResponse, ok } from '../../../../main/utils';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} DeleteFunctionalityImageResponse
 * @property {Messages} message
 * @property {string} status
 */

/**
 * DELETE /functionality-image/image-on-functionality/{id}
 * @summary Delete Functionality Image
 * @tags Functionality-image
 * @security BearerAuth
 * @param {number} id.path.required
 * @return {DeleteFunctionalityImageResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const deleteImageOnFunctionalityImageController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await DataSource.imagesOnFunctionality.update({
        data: {
          finishedAt: new Date()
        },
        select: { id: true },
        where: { id: Number(request.params.id) }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({
        entity: { english: 'Functionality image', portuguese: 'Imagem da funcionalidade' },
        error,
        response
      });
    }
  };
