/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { DataSource } from '../../../../infra/database';
import { ValidationError } from 'yup';
import {
  errorLogger,
  messageErrorResponse,
  ok,
  validationErrorResponse
} from '../../../../main/utils';
import { functionalityImageFindParams } from '../../../../data/search';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  functionalityId: number;
}

/**
 * @typedef {object} InsertFunctionalityImageBody
 * @property {string} functionalityId.required
 */

/**
 * @typedef {object} InsertFunctionalityImageResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Messages} payload
 */

/**
 * POST /functionality-image
 * @summary Insert Functionality image
 * @tags Functionality-image
 * @security BearerAuth
 * @param {InsertFunctionalityImageBody} request.body.required
 * @return {InsertFunctionalityImageResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertFunctionalityImageController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { functionalityId } = request.body as Body;

      const payload = await DataSource.functionalityImage.create({
        data: { active: false, functionalityId },
        select: functionalityImageFindParams
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
