import { DataSource } from '../../../../infra/database';
import { errorLogger, getPagination, messageErrorResponse, ok } from '../../../../main/utils';
import { functionalityFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

/**
 * @typedef {object} FindFavoriteUserFunctionalityPayload
 * @property {array<FavoriteUserFunctionality>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindFavoriteUserFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 * @property {FindFavoriteUserFunctionalityPayload} payload
 */

/**
 * GET /favorite-user-functionality
 * @summary Find FavoriteUserFunctionality
 * @tags FavoriteUserFunctionality
 * @security BearerAuth
 * @param {number} userId.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:createdAt,updatedAt
 * @param {string} sort.query - enum:asc,desc
 * @param {boolean} history.query
 * @return {FindFavoriteUserFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findFavoriteUserFunctionalityController: Controller =
  () =>
  async ({ query, user }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const search = await DataSource.functionality.findMany({
        select: functionalityFindParams(false),
        skip,
        take,
        where: {
          favoriteUserFunctionality: {
            some: {
              userId: typeof query.userId === 'string' ? Number(query.userId) : user.id
            }
          }
        }
      });

      const totalElements = await DataSource.functionality.count({
        where: {
          favoriteUserFunctionality: {
            some: {
              userId: typeof query.userId === 'string' ? Number(query.userId) : user.id
            }
          }
        }
      });

      return ok({
        payload: {
          content: search,
          totalElements,
          totalPages: Math.ceil(totalElements / take)
        },
        response
      });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
