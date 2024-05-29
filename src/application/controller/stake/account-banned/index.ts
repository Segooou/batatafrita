/* eslint-disable consistent-return */
import { DataSource } from '../../../../infra/database';
import { badRequest, errorLogger, messageErrorResponse, ok } from '../../../../main/utils';
import { findEmail } from '../../../helper/find-email';
import {
  type functionToExecProps,
  readGoogleSheet,
  type readGoogleSheetProps
} from '../../../helper/read-sheet';
import type { Controller } from '../../../../domain/protocols';
import type { DataProps, OnFindEmailProps } from '../../../helper/find-email';
import type { Request, Response } from 'express';

interface Body {
  email: string;
  password: string;
  functionalityId: number;
  googleSheets?: readGoogleSheetProps;
}

/**
 * POST /stake/account-banned
 * @summary Account Banned Stake
 * @tags Stake
 * @security BearerAuth
 * @param {EmailGoogleSheetsBody} request.body.required
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const stakeAccountBannedController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { email, password, googleSheets, functionalityId } = request.body as Body;

      const finalResults: DataProps[] = [];

      const convertResult = (result: string): string => {
        switch (result) {
          case 'LOGIN failed.':
            return 'Erro ao fazer login';

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

          await DataSource.action.createMany({
            data,
            skipDuplicates: true
          });
        }

        ok({ payload: finalResults, response });
        response.end();
      };

      const onFindEmail = ({ result }: OnFindEmailProps): void => {
        result.push('Conta foi suspensa');
      };

      const onEnd = (data: DataProps): void => {
        let newResult: DataProps | undefined;

        if (data.hasError && typeof data.errorMessage === 'string') {
          newResult = { ...data, result: [convertResult(data.errorMessage)] };
          data.result.push(convertResult(data.errorMessage));
        } else if (data.result.length === 0) {
          newResult = { ...data, result: ['Conta ok'] };
          data.result.push('Conta ok');
        } else newResult = data;

        finalResults.push(newResult);
      };

      const functionToExec = async (data: functionToExecProps): Promise<string[]> => {
        const res = await findEmail({
          email: data.email,
          from: 'noreply@stake.com',
          onEnd,
          onFindEmail,
          password: data.password,
          subject: ['A sua conta foi suspensa', 'Your account has been suspended']
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
