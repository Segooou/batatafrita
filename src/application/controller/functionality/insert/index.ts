import { DataSource } from '../../../../infra/database';
import { ValidationError } from 'yup';
import {
  errorLogger,
  messageErrorResponse,
  normalizeText,
  ok,
  validationErrorResponse
} from '../../../../main/utils';
import { functionalityFindParams } from '../../../../data/search';
import { insertFunctionalitySchema } from '../../../../data/validation';
import type { Controller } from '../../../../domain/protocols';
import type { InputProps, InputType } from '@prisma/client';
import type { Request, Response } from 'express';

export interface InputProps2 {
  label: string;
  placeholder: string;
  isRequired: boolean;
  error: boolean;
  type: InputType;
  mask?: string;
  maskLength?: number;
}

interface Body {
  name: string;
  apiRoute: string;
  description?: string;
  platformId: number;
  inputProps: InputProps[];
}

/**
 * @typedef {object} InputPropsInsert
 * @property {string} label.required
 * @property {string} placeholder.required
 * @property {boolean} isRequired.required
 * @property {string} type.required
 * @property {string} mask
 * @property {number} maskLength
 */

/**
 * @typedef {object} InsertFunctionalityBody
 * @property {string} name.required
 * @property {string} apiRoute.required
 * @property {string} description
 * @property {array<InputPropsInsert>} inputProps.required
 * @property {number} platformId.required
 */

/**
 * @typedef {object} InsertFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Functionality} payload
 */

/**
 * POST /functionality
 * @summary Insert Functionality
 * @tags Functionality
 * @security BearerAuth
 * @param {InsertFunctionalityBody} request.body.required
 * @return {InsertFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertFunctionalityController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await insertFunctionalitySchema.validate(request, { abortEarly: false });

      const { apiRoute, inputProps, name, platformId, description } = request.body as Body;

      const payload = await DataSource.functionality.create({
        data: {
          apiRoute,
          description,
          inputProps: {
            createMany: {
              data: inputProps
            }
          },
          keyword: normalizeText(name),
          name,
          platformId
        },
        select: functionalityFindParams(true)
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
