import { DataSource } from '../../../../infra/database';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '../../../../main/utils';
import { platformFindParams } from '../../../../data/search';
import { platformListQueryFields } from '../../../../data/validation';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';
import type { platformQueryFields } from '../../../../data/validation';

/**
 * @typedef {object} FindPlatformPayload
 * @property {array<Platform>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindPlatformResponse
 * @property {Messages} message
 * @property {string} status
 * @property {FindPlatformPayload} payload
 */

/**
 * GET /platform
 * @summary Find Platforms
 * @tags Platform
 * @security BearerAuth
 * @param {string} name.query
 * @param {boolean} all.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,createdAt,updatedAt
 * @param {string} sort.query - enum:asc,desc
 * @param {boolean} history.query
 * @return {FindPlatformResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findPlatformController: Controller =
  () =>
  async ({ query }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });
      const { orderBy, where } = getGenericFilter<platformQueryFields>({
        list: platformListQueryFields,
        query
      });

      const functionalities =
        query.all === 'true'
          ? {}
          : {
              some: {}
            };

      const search = await DataSource.platform.findMany({
        orderBy,
        select: platformFindParams,
        skip,
        take,
        where: {
          ...where,
          functionalities
        }
      });

      const totalElements = await DataSource.platform.count({
        where: {
          ...where,
          functionalities
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
