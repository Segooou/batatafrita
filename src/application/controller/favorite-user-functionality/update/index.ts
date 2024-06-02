import { DataSource } from '../../../../infra/database';
import { ValidationError } from 'yup';
import {
  errorLogger,
  messageErrorResponse,
  ok,
  validationErrorResponse
} from '../../../../main/utils';
import { updateFavoriteUserFunctionalitySchema } from '../../../../data/validation';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  isFavorite: boolean;
  functionalityId: number;
}

/**
 * @typedef {object} UpdateFavoriteUserFunctionalityBody
 * @property {boolean} isFavorite.required
 * @property {number} functionalityId.required
 */

/**
 * @typedef {object} UpdateFavoriteUserFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 * @property {FavoriteUserFunctionality} payload
 */

/**
 * PUT /favorite-user-functionality
 * @summary Update FavoriteUserFunctionality
 * @tags FavoriteUserFunctionality
 * @security BearerAuth
 * @param {UpdateFavoriteUserFunctionalityBody} request.body
 * @return {UpdateFavoriteUserFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateFavoriteUserFunctionalityController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await updateFavoriteUserFunctionalitySchema.validate(request, { abortEarly: false });

      const { isFavorite, functionalityId } = request.body as Body;

      await DataSource.favoriteUserFunctionality.deleteMany({
        where: { functionalityId, userId: Number(request.user.id) }
      });

      if (isFavorite)
        await DataSource.favoriteUserFunctionality.createMany({
          data: { functionalityId, userId: Number(request.user.id) }
        });

      return ok({ response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({
        entity: { english: 'FavoriteUserFunctionality', portuguese: 'Nova Funcionalidade' },
        error,
        response
      });
    }
  };
