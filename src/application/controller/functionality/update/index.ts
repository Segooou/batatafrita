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
import type { $Enums, InputProps } from '@prisma/client';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  apiRoute?: string;
  description?: string;
  platformId?: number;
  googleSheets?: number;
  inputProps?: InputProps[];
  messageNotFound?: string;
  from?: string;
  regex?: string;
  messageOnFind?: string;
  subject?: string[];
  text?: string[];
  indexToGet?: number[];
  textToReplace?: string[][];
  active?: boolean;
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
      const {
        apiRoute,
        description,
        googleSheets,
        inputProps,
        active,
        from,
        indexToGet,
        messageNotFound,
        messageOnFind,
        regex,
        subject,
        text,
        textToReplace,
        platformId
      } = request.body as Body;

      interface props {
        formValue: string;
        isRequired: boolean;
        label: string;
        placeholder: string;
        type: $Enums.InputType;
      }
      const inputPropsValues: props[] = [];

      if (typeof inputProps !== 'undefined' && inputProps?.length > 0) {
        await DataSource.inputProps.deleteMany({
          where: { functionalityId: Number(request.params.id) }
        });
        inputProps.forEach((item) => {
          inputPropsValues.push(item as unknown as props);
        });
      }

      const newApiRoute =
        typeof apiRoute === 'string' && apiRoute.length > 0 ? apiRoute : '/functionality/execute';

      const payload = await DataSource.functionality.update({
        data: {
          active,
          apiRoute: newApiRoute,
          description,
          from,
          googleSheets,
          indexToGet,
          inputProps: {
            createMany: {
              data: inputPropsValues
            }
          },
          messageNotFound,
          messageOnFind,
          platformId,
          regex,
          subject,
          text,
          textToReplace
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
