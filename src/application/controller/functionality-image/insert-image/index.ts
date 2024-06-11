/* eslint-disable no-undefined */
import { ValidationError } from 'yup';

import { DataSource } from '../../../../infra/database';
import {
  badRequest,
  defaultFolder,
  errorLogger,
  getMainImage,
  messageErrorResponse,
  ok,
  validationErrorResponse
} from '../../../../main/utils';
import { generateAzurePathJpeg, uploadFileToAzure } from '../../../../infra/azure-blob';
import { messages } from '../../../../domain/helpers';
import { unlink } from 'fs';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  filename: string;
  functionalityImageId: number;
}

/**
 * @typedef {object} InsertImageOnFunctionalityBody
 * @property {number} functionalityImageId
 * @property {string} image - image cover - binary
 */

/**
 * @typedef {object} InsertImageOnFunctionalityResponse
 * @property {Messages} message
 * @property {string} status
 * @property {Messages} payload
 */

/**
 * POST /functionality-image/file
 * @summary Update Functionality image
 * @tags Functionality-image
 * @security BearerAuth
 * @param {InsertImageOnFunctionalityBody} request.body - image - multipart/form-data
 * @param {number} id.path.required
 * @return {InsertImageOnFunctionalityResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const insertImageOnFunctionalityController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { filename, functionalityImageId } = request.body as Body;

      const image = await getMainImage({ image: filename }).toBuffer();

      const azurePath = generateAzurePathJpeg('foto');

      const url = await uploadFileToAzure({ azurePath, containerName: 'foto', image });

      if (url === null) return badRequest({ message: messages.default.badFileUpload, response });

      try {
        unlink(defaultFolder(filename), (err): void => {
          console.info(err);
        });
      } catch (error) {
        console.info(error);
      }

      await DataSource.imagesOnFunctionality.create({
        data: { functionalityImageId: Number(functionalityImageId), url },
        select: { id: true }
      });

      return ok({ payload: messages.default.successfullyDeleted, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({
        entity: { english: 'Functionality image', portuguese: 'Imagem da funcionalidade' },
        error,
        response
      });
    }
  };
