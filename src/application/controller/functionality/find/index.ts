import { DataSource } from '../../../../infra/database';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '../../../../main/utils';
import { functionalityFindParams } from '../../../../data/search';
import { functionalityListQueryFields } from '../../../../data/validation';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';
import type { functionalityQueryFields } from '../../../../data/validation';

/**
 * @typedef {object} FindFunctionalityPayload
 * @property {array<Functionality>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 * @property {FindFunctionalityPayload} payload
 */

/**
 * GET /functionality
 * @summary Find Functionality
 * @tags Functionality
 * @security BearerAuth
 * @param {string} name.query
 * @param {string} description.query
 * @param {number} platformId.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,description,createdAt,updatedAt
 * @param {string} sort.query - enum:asc,desc
 * @param {boolean} history.query
 * @return {FindFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findFunctionalityController: Controller =
  () =>
  async ({ query, user }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });
      const { orderBy, where } = getGenericFilter<functionalityQueryFields>({
        list: functionalityListQueryFields,
        query
      });

      const search = await DataSource.functionality.findMany({
        orderBy,
        select: {
          ...functionalityFindParams(false),
          favoriteUserFunctionality: {
            select: {
              id: true
            },
            where: {
              userId: user.id
            }
          }
        },
        skip,
        take,
        where
      });

      const totalElements = await DataSource.functionality.count({
        where
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
