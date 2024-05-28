/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable no-undefined */
import { type PrettyYupError, formatYupError } from '../yup-resolver-errors';
import { messages, statusCodeList } from '../../../domain/helpers';
import type { Response } from 'express';
import type { ValidationError } from 'yup';
import type { messageTypeResponse } from '../../../domain/errors';

export const created = ({
  response,
  payload = {}
}: {
  response: Response;
  payload?: object;
}): Response =>
  response.status(statusCodeList.CREATED).json({
    errors: [],
    message: messages.default.ok,
    payload,
    status: 'request successfully'
  });

export const ok = ({
  response,
  payload = {}
}: {
  response: Response;
  payload?: unknown;
}): Response =>
  response.status(statusCodeList.OK).json({
    errors: [],
    message: messages.default.ok,
    payload,
    status: 'request successfully'
  });

export const badRequest = ({
  response,
  message = messages.default.badRequest,
  errors = [],
  payload = {}
}: {
  response: Response;
  message?: messageTypeResponse;
  errors?: PrettyYupError[] | [];
  payload?: object;
}): Response =>
  response.status(statusCodeList.BAD_REQUEST).json({
    errors,
    message,
    payload,
    status: 'bad request'
  });

export const notFound = ({
  entity,
  response,
  message = messages.default.notFound(entity),
  payload = {},
  errors = []
}: {
  entity: messageTypeResponse;
  response: Response;
  message?: messageTypeResponse;
  payload?: object;
  errors?: PrettyYupError[] | [];
}): Response =>
  response.status(statusCodeList.NOT_FOUND).json({
    errors,
    message,
    payload,
    status: 'not found'
  });

export const unauthorized = ({
  response,
  message = messages.default.unauthorized,
  errors = [],
  payload = {}
}: {
  response: Response;
  message?: messageTypeResponse;
  errors?: PrettyYupError[] | [];
  payload?: object;
}): Response =>
  response.status(statusCodeList.NOT_AUTHORIZED).json({
    errors,
    message,
    payload,
    status: 'unauthorized'
  });

export const forbidden = ({
  response,
  message,
  errors = [],
  payload = {}
}: {
  response: Response;
  message: {
    english: string;
    portuguese: string;
  };
  errors?: PrettyYupError[] | [];
  payload?: object;
}): Response =>
  response.status(statusCodeList.FORBIDDEN).json({
    errors,
    message: messages.auth.notPermission(message),
    payload,
    status: 'forbidden'
  });

export const timeout = ({
  response,
  message = messages.default.timeout,
  errors = [],
  payload = {}
}: {
  response: Response;
  message?: messageTypeResponse;
  errors?: PrettyYupError[] | [];
  payload?: object;
}): Response =>
  response.status(statusCodeList.TIMEOUT).json({
    errors,
    message,
    payload,
    status: 'timeout'
  });

export const messageErrorResponse = ({
  error,
  response,
  entity
}: {
  error: unknown;
  entity?: messageTypeResponse;
  response: Response;
}): Response => {
  const newError = error as { message?: string; meta?: { cause: string; modelName: string } };
  let message: messageTypeResponse | undefined;

  if (newError?.meta?.cause === 'Record to update not found.')
    return notFound({
      entity: entity ?? {
        english: newError?.meta?.modelName,
        portuguese: newError?.meta?.modelName
      },
      message,
      response
    });

  if (
    newError?.message === 'LOGIN failed.' ||
    newError?.message === 'Timed out while authenticating with server'
  )
    return badRequest({
      message: {
        english: newError.message,
        portuguese: 'Não foi possível fazer o login no e-mail'
      },
      response
    });

  if (error instanceof Error)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    message = newError.message
      ? {
          english: newError.message,
          portuguese: 'Erro interno do servidor...'
        }
      : // eslint-disable-next-line no-undefined
        undefined;

  return badRequest({
    message,
    response
  });
};

export const validationErrorResponse = ({
  error,
  response
}: {
  error: ValidationError;
  response: Response;
}): Response =>
  badRequest({
    errors: formatYupError(error),
    message: messages.default.validationErrorResponse,
    response
  });
