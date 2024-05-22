/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable max-nested-callbacks */
import { DataSource } from '../../../../infra/database';
import { ValidationError } from 'yup';
import {
  errorLogger,
  messageErrorResponse,
  notFound,
  ok,
  validationErrorResponse
} from '../../../../main/utils';
import { insertEmailSchema } from '../../../../data/validation';
import Imap from 'imap';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';

interface Body {
  email: string;
  password: string;
  functionalityId: number;
}

/**
 * @typedef {object} InsertStakeLoginCodeBody
 * @property {string} email.required
 * @property {string} password.required
 * @property {number} functionalityId.required
 */

/**
 * POST /stake/login-code
 * @summary Login code Stake
 * @tags Stake
 * @security BearerAuth
 * @example request - payload example
 * {
 *   "email": "ElizabethAndrews828770@outlook.com",
 *   "password": "Elizabeth7242"
 * }
 * @param {InsertStakeLoginCodeBody} request.body.required
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const stakeLoginCodeController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await insertEmailSchema.validate(request, { abortEarly: false });

      const { email, password, functionalityId } = request.body as Body;

      const emails: string[] = [];

      const imapConfig = {
        connTimeout: 999999999,
        host: 'outlook.office365.com',
        password,
        port: 993,
        tls: true,
        user: email
      };

      const imap = new Imap(imapConfig);

      const searchEmail = (): void => {
        imap.search(
          [
            ['FROM', 'noreply@stake.com'],
            ['SUBJECT', 'Entrar em Stake.com']
          ],
          (err2, results) => {
            if (err2) throw new Error('');
            if (results.length > 0) {
              const fetch = imap.fetch(results, { bodies: '' });

              fetch.on('message', (msg) => {
                msg.on('body', (stream) => {
                  let buffer = '';

                  stream.on('data', (chunk) => {
                    buffer += chunk.toString('utf8');
                  });

                  stream.on('end', () => {
                    const regex = /<td>(?:\d{6})<\/td>/gu;
                    const match = buffer.match(regex);

                    if (match) emails.push(match?.[0].replace('<td>', '').replace('</td>', ''));
                  });
                });
              });

              fetch.once('end', () => {
                imap.closeBox(() => {
                  searchNextMailbox();
                });
              });
            } else searchNextMailbox();
          }
        );
      };

      const mailboxesToSearch = ['JUNK', 'INBOX'];

      const searchNextMailbox = (): void => {
        if (mailboxesToSearch.length > 0) {
          const nextMailbox = mailboxesToSearch.shift();

          imap.openBox(nextMailbox!, true, (err, box) => {
            if (err) throw new Error('');

            if (box.messages.total > 0) searchEmail();
            else searchNextMailbox();
          });
        } else imap.end();
      };

      imap.once('ready', () => {
        const initialMailbox = mailboxesToSearch.shift();

        imap.openBox(initialMailbox!, true, (err, box) => {
          if (err) throw new Error('');

          if (box.messages.total > 0) searchEmail();
          else searchNextMailbox();
        });
      });

      imap.once('error', () => {
        imap.end();
      });

      imap.once('end', async () => {
        if (emails.length > 0) {
          await DataSource.action.create({
            data: {
              data: {
                email,
                senha: password
              },
              functionalityId,
              hasError: false,
              result: emails[0],
              userId: request.user.id
            }
          });
          return ok({ payload: emails[0], response });
        }

        await DataSource.action.create({
          data: {
            data: {
              email,
              senha: password
            },
            functionalityId,
            hasError: true,
            result: 'E-mail não encontrado',
            userId: request.user.id
          }
        });
        return notFound({
          entity: {
            english: 'Email',
            portuguese: 'E-mail'
          },
          response
        });
      });

      imap.connect();
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
