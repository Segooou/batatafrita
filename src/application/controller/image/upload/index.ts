import { errorLogger, messageErrorResponse, ok } from '../../../../main/utils';
import { messages } from '../../../../domain/helpers';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

/**
 * POST /image/upload
 * @summary Upload image
 * @tags Image
 * @security BearerAuth
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const uploadImageController: Controller = () => (request: Request, response: Response) => {
  try {
    return ok({ payload: messages.default.successfullyCreated, response });
  } catch (error) {
    errorLogger(error);

    return messageErrorResponse({ error, response });
  }
};
