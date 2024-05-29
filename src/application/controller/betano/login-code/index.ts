/* eslint-disable consistent-return */
import { errorLogger, messageErrorResponse } from '../../../../main/utils';
import { useFindEmail } from '../../../helper';
import type { Controller } from '../../../../domain/protocols';
import type { DataProps, OnFindEmailProps } from '../../../helper/find-email';
import type { Request, Response } from 'express';

/**
 * POST /betano/login-code
 * @summary Login code Betano
 * @tags Betano
 * @security BearerAuth
 * @example request - payload example
 * {
 *   "email": "JodiIngram677200@outlook.com",
 *   "password": "Jodi7002"
 * }
 * @param {EmailGoogleSheetsBody} request.body.required
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const betanoLoginCodeController: Controller =
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
        const regex = /<strong(?:\s+[^>]*)?>(?<temp1>.*?)<\/strong>/gu;

        const filtered: string[] = [];

        buffer.replace(regex, (match2, content) => {
          filtered.push(content);

          return content;
        });

        filtered.forEach((item) => {
          if (!item?.startsWith('R$')) result.push(item);
        });
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
        from: 'suporte@betano.com',
        onEnd,
        onFindEmail,
        request,
        response,
        text: ['Para ativar a conta']
      });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
