import { DataSource } from '../../../../infra/database';
import {
  errorLogger,
  getGenericFilter,
  getPagination,
  messageErrorResponse,
  ok
} from '../../../../main/utils';
import { functionalityImageFindParams } from '../../../../data/search';
import { functionalityImageListQueryFields } from '../../../../data/validation';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';
import type { functionalityImageQueryFields } from '../../../../data/validation';

/**
 * @typedef {object} FindFunctionalityImagePayload
 * @property {array<FunctionalityImage>} content
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} FindFunctionalityImageResponse
 * @property {Messages} message
 * @property {string} status
 * @property {FindFunctionalityImagePayload} payload
 */

/**
 * GET /functionality-image
 * @summary Find Functionality image
 * @tags Functionality-image
 * @security BearerAuth
 * @param {number} functionalityId.query
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {string} startDate.query (Ex: 2024-01-01).
 * @param {string} endDate.query (Ex: 2024-01-01).
 * @param {string} orderBy.query - enum:name,description,createdAt,updatedAt
 * @param {string} sort.query - enum:asc,desc
 * @param {boolean} history.query
 * @return {FindFunctionalityImageResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findFunctionalityImageController: Controller =
  () =>
  async ({ query }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });
      const { orderBy, where } = getGenericFilter<functionalityImageQueryFields>({
        list: functionalityImageListQueryFields,
        query
      });

      const search = await DataSource.functionalityImage.findMany({
        orderBy,
        select: functionalityImageFindParams,
        skip,
        take,
        where
      });

      const totalElements = await DataSource.functionalityImage.count({
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
