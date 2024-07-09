import { DataSource } from '../../../../infra/database';
import { errorLogger, getPagination, messageErrorResponse, ok } from '../../../../main/utils';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

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
 * GET /functionality/resume
 * @summary Find Functionality
 * @tags Functionality
 * @security BearerAuth
 * @param {integer} page.query
 * @param {integer} limit.query
 * @param {boolean} history.query
 * @return {FindFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 */
export const findFunctionalityResumeController: Controller =
  () =>
  async ({ query }: Request, response: Response) => {
    try {
      const { skip, take } = getPagination({ query });

      const search = await DataSource.functionality.findMany({
        select: {
          id: true,
          name: true,
          platform: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip,
        take,
        where: {
          active: true,
          finishedAt: null
        }
      });

      const totalElements = await DataSource.functionality.count({});

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
