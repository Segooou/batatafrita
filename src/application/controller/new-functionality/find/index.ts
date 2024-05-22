import { DataSource } from '../../../../infra/database';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '../../../../main/utils';
import { newFunctionalityFindParams } from '../../../../data/search';
import { newFunctionalityListQueryFields } from '../../../../data/validation';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';
import type { newFunctionalityQueryFields } from '../../../../data/validation';

/**
 * @typedef {object} FindNewFunctionalityPayload
 * @property {array<NewFunctionality>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindNewFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 * @property {FindNewFunctionalityPayload} payload
 */

/**
 * GET /new-functionality
 * @summary Find NewFunctionality
 * @tags NewFunctionality
 * @security BearerAuth
 * @param {string} name.query
 * @param {string} description.query
 * @param {number} platformId.query
 * @param {number} userId.query
 * @param {boolean} wasRaisedBoolean.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,description,wasRaised,createdAt,updatedAt
 * @param {string} sort.query - enum:asc,desc
 * @param {boolean} history.query
 * @return {FindNewFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findNewFunctionalityController: Controller =
  () =>
  async ({ query }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });
      const { orderBy, where } = getGenericFilter<newFunctionalityQueryFields>({
        list: newFunctionalityListQueryFields,
        query
      });

      const search = await DataSource.newFunctionality.findMany({
        orderBy,
        select: newFunctionalityFindParams,
        skip,
        take,
        where
      });

      const totalElements = await DataSource.newFunctionality.count({
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
