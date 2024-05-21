import { DataSource } from '../../../../infra/database';
import { actionFindParams } from '../../../../data/search';
import { actionListQueryFields } from '../../../../data/validation';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '../../../../main/utils';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';
import type { actionQueryFields } from '../../../../data/validation';

/**
 * @typedef {object} FindActionPayload
 * @property {array<Action>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindActionResponse
 * @property {Messages} message
 * @property {string} status
 * @property {FindActionPayload} payload
 */

/**
 * GET /action
 * @summary Find Actions
 * @tags Action
 * @security BearerAuth
 * @param {number} functionalityId.query
 * @param {boolean} hasErrorBoolean.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:createdAt,updatedAt
 * @param {string} sort.query - enum:asc,desc
 * @param {boolean} history.query
 * @return {FindActionResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findActionController: Controller =
  () =>
  async ({ query }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });
      const { orderBy, where } = getGenericFilter<actionQueryFields>({
        list: actionListQueryFields,
        query
      });

      const search = await DataSource.action.findMany({
        orderBy,
        select: actionFindParams,
        skip,
        take,
        where
      });

      const totalElements = await DataSource.action.count({
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
