/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { DataSource } from '../../../../infra/database';
import { ValidationError } from 'yup';
import {
  errorLogger,
  messageErrorResponse,
  normalizeText,
  notFound,
  ok,
  validationErrorResponse
} from '../../../../main/utils';
import { functionalityFindParams } from '../../../../data/search';
import type { $Enums, InputProps } from '@prisma/client';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  apiRoute?: string;
  description?: string;
  platformId: number;
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
 * @typedef {object} InputPropsInsert
 * @property {string} label.required
 * @property {string} placeholder.required
 * @property {boolean} isRequired.required
 * @property {string} type.required
 * @property {string} formValue.required
 * @property {string} mask
 * @property {number} maskLength
 */

/**
 * @typedef {object} InsertFunctionalityBody
 * @property {string} name.required
 * @property {string} apiRoute.required
 * @property {string} description
 * @property {number} googleSheets
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
      const {
        apiRoute,
        inputProps,
        name,
        active,
        from,
        indexToGet,
        messageNotFound,
        messageOnFind,
        regex,
        subject,
        text,
        textToReplace,
        platformId,
        description
      } = request.body as Body;

      const platform = await DataSource.platform.findUnique({
        select: {
          keyword: true
        },
        where: {
          id: platformId
        }
      });

      if (platform === null)
        return notFound({
          entity: {
            english: 'Platform',
            portuguese: 'Plataforma'
          },
          response
        });

      const inputPropsValues: Array<{
        formValue: string;
        isRequired: boolean;
        label: string;
        placeholder: string;
        type: $Enums.InputType;
      }> = [];

      if (typeof inputProps === 'undefined' || inputProps?.length === 0) {
        inputPropsValues.push({
          formValue: 'email',
          isRequired: true,
          label: 'E-mail',
          placeholder: 'Digite o e-mail',
          type: 'email'
        });
        inputPropsValues.push({
          formValue: 'password',
          isRequired: true,
          label: 'Senha',
          placeholder: 'Digite a senha',
          type: 'text'
        });
      } else inputProps.forEach((item) => inputPropsValues.push(item));

      const newApiRoute =
        typeof apiRoute === 'string' && apiRoute.length > 0 ? apiRoute : '/functionality/execute';

      const payload = await DataSource.functionality.create({
        data: {
          active,
          apiRoute: newApiRoute,
          description,
          from,
          googleSheets: 1,
          indexToGet,
          inputProps: {
            createMany: {
              data: inputPropsValues
            }
          },
          keyword: `${normalizeText(name)}-${platform.keyword}`,
          messageNotFound,
          messageOnFind,
          name,
          platformId,
          regex,
          subject,
          text,
          textToReplace
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
