import { DataSource } from '../../../../infra/database';
import { errorLogger, messageErrorResponse, notFound, ok } from '../../../../main/utils';
import { platformFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

/**
 * GET /platform/keyword/{id}
 * @summary Find one Platform by keyword
 * @tags Platform
 * @security BearerAuth
 * @param {string} id.path.required
 * @return {FindOnePlatformResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {NotFoundRequest} 404 - Not found response - application/json
 */
export const findOnePlatformByKeywordController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await DataSource.platform.findUnique({
        select: platformFindParams,
        where: { keyword: request.params.id }
      });

      if (payload === null)
        return notFound({
          entity: { english: 'Platform', portuguese: 'Plataforma' },
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
