/* eslint-disable consistent-return */
import { DataSource } from '../../../../infra/database';
import { badRequest, errorLogger, messageErrorResponse, ok } from '../../../../main/utils';
import {
  type functionToExecProps,
  readGoogleSheet,
  type readGoogleSheetProps
} from '../../../helper/read-sheet';
import { validateEmail } from '../../../helper';
import type { Controller } from '../../../../domain/protocols';
import type { DataProps } from '../../../helper/find-email';
import type { Request, Response } from 'express';

interface Body {
  email: string;
  password: string;
  functionalityId: number;
  googleSheets?: readGoogleSheetProps;
}

/**
 * POST /google-sheets/check-email
 * @summary Check if email is valid
 * @tags Google Sheets
 * @security BearerAuth
 * @param {EmailGoogleSheetsBody} request.body.required
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const googleSheetsCheckEmailController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { email, password, googleSheets, functionalityId } = request.body as Body;

      const finalResults: DataProps[] = [];

      const convertResult = (result: string): string => {
        switch (result) {
          case 'LOGIN failed.':
            return 'Bloqueado';

          default:
            return result ?? 'Error';
        }
      };

      const finishFunction = async (): Promise<void> => {
        if (typeof functionalityId === 'number') {
          const data = finalResults.map((item) => ({
            data: item.data,
            functionalityId,
            result: item.result,
            userId: request.user.id
          }));

          if (data.length > 0)
            await DataSource.action.createMany({
              data,
              skipDuplicates: true
            });
        }

        ok({ payload: finalResults, response });
        response.end();
      };

      const onFindEmail = ({ result }: DataProps): void => {
        result.push('Live');
      };

      const onEnd = (data: DataProps): void => {
        let newResult: DataProps | undefined;

        if (data.hasError && typeof data.errorMessage === 'string') {
          newResult = { ...data, result: [convertResult(data.errorMessage)] };
          data.result.push(convertResult(data.errorMessage));
        } else newResult = data;

        finalResults.push(newResult);
      };

      const functionToExec = async (data: functionToExecProps): Promise<string[]> => {
        const res = await validateEmail({
          email: data.email,
          onEnd,
          onFindEmail,
          password: data.password
        });

        return res;
      };

      if (typeof googleSheets === 'undefined') {
        await functionToExec({ email, password });
        await finishFunction();
      } else if (Number(googleSheets.endRow) >= Number(googleSheets.startRow)) {
        await readGoogleSheet({
          ...googleSheets,
          functionToExec
        });
        await finishFunction();
      } else {
        badRequest({
          message: {
            english: 'Final de linha tem que ser maior que início',
            portuguese: 'Final de linha tem que ser maior que início'
          },
          response
        });
        response.end();
      }
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
