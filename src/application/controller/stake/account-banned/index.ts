/* eslint-disable consistent-return */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-negated-condition */
import { DataSource } from '../../../../infra/database';
import { badRequest, errorLogger, messageErrorResponse, ok } from '../../../../main/utils';
import { convertResult } from '../../../helper';
import { findEmail } from '../../../helper/find-email';
import {
  type functionToExecProps,
  readGoogleSheet,
  type readGoogleSheetProps
} from '../../../helper/read-sheet';
import type { Controller } from '../../../../domain/protocols';
import type { OnEndProps, OnFindEmailProps, dataProps } from '../../../helper/find-email';
import type { Request, Response } from 'express';

interface Body {
  email: string;
  password: string;
  functionalityId: number;
  googleSheets?: readGoogleSheetProps;
}

/**
 * @typedef {object} InsertStakeAccountBannedBody
 * @property {string} email.required
 * @property {string} password.required
 * @property {number} functionalityId.required
 * @property {GoogleSheets} googleSheets
 */

/**
 * POST /stake/account-banned
 * @summary Account Banned Stake
 * @tags Stake
 * @security BearerAuth
 * @param {InsertStakeAccountBannedBody} request.body.required
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const stakeAccountBannedController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { email, password, googleSheets, functionalityId } = request.body as Body;

      const finalResults: dataProps[] = [];

      let error: dataProps | undefined;

      let len = -1;

      if (typeof googleSheets !== 'undefined')
        len = googleSheets.endRow - googleSheets.startRow + 1;

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

      const onError = ({ data, result }: dataProps): void => {
        error = { data, result: convertResult(result) };
      };

      const onFindEmail = ({ result }: OnFindEmailProps): void => {
        result.push('Conta foi suspensa');
      };

      const onEnd = ({ data, result, hasError }: OnEndProps): void => {
        let newResult: dataProps | undefined;

        if (hasError && typeof error !== 'undefined') {
          newResult = { ...error };
          error = undefined;
        } else if (result.length === 0) newResult = { data, result: ['Conta ok'] };
        else newResult = { data, result };

        finalResults.push(newResult);

        if (finalResults.length === len || len === -1) finishFunction();
      };

      const functionToExec = async (data: functionToExecProps): Promise<string[]> => {
        const res = await findEmail({
          email: data.email,
          from: 'noreply@stake.com',
          onEnd,
          onError,
          onFindEmail,
          password: data.password,
          subject: 'A sua conta foi suspensa'
        });

        return res;
      };

      if (typeof googleSheets !== 'undefined')
        if (googleSheets.endRow >= googleSheets.startRow)
          await readGoogleSheet({
            ...googleSheets,
            functionToExec
          });
        else
          badRequest({
            message: {
              english: 'Final de linha tem que ser maior que início',
              portuguese: 'Final de linha tem que ser maior que início'
            },
            response
          });
      else await functionToExec({ email, password });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
