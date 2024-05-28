/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable max-nested-callbacks */
import { errorLogger, messageErrorResponse, ok } from '../../../../main/utils';
import { findEmail } from '../../../helper/find-email';
import type { Controller } from '../../../../domain/protocols';
import type { OnEndProps, OnFindEmailProps } from '../../../helper/find-email';
import type { Request, Response } from 'express';
import type { readGoogleSheetProps } from '../../../helper/read-sheet';

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
      const { functionalityId, googleSheets, email, password } = request.body as Body;

      let finalError: Error | undefined;
      let finalEmails: string[] = [];

      const onError = (error: Error): void => {
        finalError = error;
      };

      const onFindEmail = ({ emails }: OnFindEmailProps): void => {
        emails.push('Conta foi suspensa');
      };

      const onEnd = ({ emails }: OnEndProps): void => {
        finalEmails = emails;
      };

      // const functionToExec = ({ email, password }: functionToExecProps): string[] => {
      //   return findEmail({
      //     email,
      //     from: 'noreply@stake.com',
      //     onEnd,
      //     onError,
      //     onFindEmail,
      //     password,
      //     subject: 'A sua conta foi suspensa'
      //   });
      // };

      // if (typeof googleSheets === 'object')
      //   await readGoogleSheet({
      //     ...googleSheets,
      //     functionToExec,
      //     functionalityId
      //   });

      // if (finalError instanceof Error) return messageErrorResponse({ error: finalError, response });

      findEmail({
        email,
        from: 'noreply@stake.com',
        onEnd,
        onError,
        onFindEmail,
        password,
        subject: 'A sua conta foi suspensa'
      });

      return ok({ payload: finalEmails, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
