/* eslint-disable no-negated-condition */
/* eslint-disable no-undefined */
/* eslint-disable consistent-return */
import { badRequest, errorLogger, messageErrorResponse } from '../../../../main/utils';
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
      const { email, password, googleSheets } = request.body as Body;

      response.setHeader('Content-Type', 'text/plain');

      const list: unknown[] = [];
      let error: dataProps | undefined;

      const onError = (result: dataProps): void => {
        error = result;
      };

      const onFindEmail = ({ result }: OnFindEmailProps): void => {
        result.push('Conta foi suspensa');
      };

      const onEnd = ({ data, result, hasError }: OnEndProps): void => {
        list.push('1');
        let len = -1;

        if (typeof googleSheets !== 'undefined')
          len = googleSheets.endRow - googleSheets.startRow + 1;

        let newResult: dataProps | undefined;

        if (hasError && typeof error !== 'undefined') {
          newResult = { ...error };
          error = undefined;
        } else if (result.length === 0) newResult = { data, result: ['Conta ok'] };
        else newResult = { data, result };

        response.write(JSON.stringify(newResult));

        if (list.length === len || len === -1) response.end();
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
