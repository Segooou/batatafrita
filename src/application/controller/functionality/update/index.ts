/* eslint-disable no-undefined */
import { ValidationError } from 'yup';

import { DataSource } from '../../../../infra/database';
import {
  errorLogger,
  messageErrorResponse,
  ok,
  validationErrorResponse,
  whereById
} from '../../../../main/utils';
import { functionalityFindParams } from '../../../../data/search';
import { updateFunctionalitySchema } from '../../../../data/validation';
import type { Controller } from '../../../../domain/protocols';
import type { InputProps } from '@prisma/client';
import type { Request, Response } from 'express';

interface Body {
  apiRoute?: string;
  description?: string;
  platformId?: number;
  googleSheets?: number;
  inputProps?: InputProps[];
}

/**
 * @typedef {object} UpdatePropsInsert
 * @property {string} label.required
 * @property {string} placeholder.required
 * @property {boolean} isRequired.required
 * @property {boolean} error.required
 * @property {string} type.required
 * @property {string} formValue.required
 * @property {string} mask
 * @property {number} maskLength
 */

/**
 * @typedef {object} UpdateFunctionalityBody
 * @property {string} description
 * @property {number} platformId
 * @property {number} googleSheets
 * @property {boolean} wasRaised
 */

/**
 * @typedef {object} UpdateFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Functionality} payload
 */

/**
 * PUT /functionality/{id}
 * @summary Update Functionality
 * @tags Functionality
 * @security BearerAuth
 * @param {UpdateFunctionalityBody} request.body
 * @param {number} id.path.required
 * @return {UpdateFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateFunctionalityController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await updateFunctionalitySchema.validate(request, { abortEarly: false });

      const { apiRoute, description, googleSheets, inputProps, platformId } = request.body as Body;

      if (typeof inputProps !== 'undefined' && inputProps?.length > 0)
        await DataSource.inputProps.deleteMany({
          where: { functionalityId: Number(request.params.id) }
        });

      const payload = await DataSource.functionality.update({
        data: {
          apiRoute,
          description,
          googleSheets,
          inputProps: {
            createMany: {
              data: inputProps ?? []
            }
          },
          platformId
        },
        select: functionalityFindParams(true),
        where: whereById(request.params.id)
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({
        entity: { english: 'Functionality', portuguese: 'Funcionalidade' },
        error,
        response
      });
    }
  };
