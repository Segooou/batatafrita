/* eslint-disable consistent-return */
import { errorLogger, messageErrorResponse } from '../../../../main/utils';
import { useFindEmail } from '../../../helper';
import type { Controller } from '../../../../domain/protocols';
import type { DataProps, OnFindEmailProps } from '../../../helper/find-email';
import type { Request, Response } from 'express';

/**
 * POST /stake/first-access
 * @summary First Access Stake
 * @tags Stake
 * @security BearerAuth
 * @example request - payload example
 * {
 *   "email": "JeremiahFoster479550@outlook.com",
 *   "password": "Jeremiah1178"
 * }
 * @param {EmailGoogleSheetsBody} request.body.required
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const stakeFirstAccessController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const finalResults: DataProps[] = [];

      const convertResult = (result: string): string => {
        switch (result) {
          case 'LOGIN failed.':
            return 'Erro ao fazer login';

          default:
            return result ?? 'Error';
        }
      };

      const onFindEmail = ({ result, buffer }: OnFindEmailProps): void => {
        const regex = /href=3D"(?<temp1>[^"]*)"/gu;
        const match = buffer.match(regex);

        if (match !== null)
          result.push(
            match?.[1]
              ?.replace(/href=3D/gu, '')
              ?.replace(/"/gu, '')
              ?.replace(/[=]\r\n/gu, '')
              ?.replace(/upn=3D/gu, 'upn=')
          );
      };

      const onEnd = (data: DataProps): void => {
        let newResult: DataProps | undefined;

        if (data.hasError && typeof data.errorMessage === 'string') {
          newResult = { ...data, result: [convertResult(data.errorMessage)] };
          data.result.push(convertResult(data.errorMessage));
        } else if (data.result.length === 0) {
          newResult = { ...data, result: ['Código não encontrado'] };
          data.result.push('Código não encontrado');
        } else newResult = data;

        finalResults.push(newResult);
      };

      await useFindEmail({
        finalResults,
        from: 'noreply@stake.com',
        onEnd,
        onFindEmail,
        request,
        response,
        subject: ['boas vindas ao Stake.com', 'welcome to Stake.com']
      });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
