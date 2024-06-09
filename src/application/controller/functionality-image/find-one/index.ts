import { DataSource } from '../../../../infra/database';
import { errorLogger, messageErrorResponse, notFound, ok } from '../../../../main/utils';
import { functionalityImageFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindOneFunctionalityImageResponse
 * @property {Messages} message
 * @property {string} status
 * @property {FunctionalityImage} payload
 */

/**
 * GET /functionality-image/{id}
 * @summary Find one Functionality image
 * @tags Functionality-image
 * @security BearerAuth
 * @param {number} id.path.required
 * @return {FindOneFunctionalityImageResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOneFunctionalityImageController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await DataSource.functionalityImage.findUnique({
        select: functionalityImageFindParams,
        where: { id: Number(request.params.id) }
      });

      if (payload === null)
        return notFound({
          entity: { english: 'Functionality image', portuguese: 'Imagem da funcionalidade' },
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
