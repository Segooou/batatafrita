/* eslint-disable max-lines-per-function */
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
 * POST /betano/login-code
 * @summary Login code Betano
 * @tags Betano
 * @security BearerAuth
 * @example request - payload example
 * {
 *   "email": "JodiIngram677200@outlook.com",
 *   "password": "Jodi7002"
 * }
 * @param {InsertStakeLoginCodeBody} request.body.required
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const betanoLoginCodeController: Controller =
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

      let lastMatch;

      const searchEmail = (): void => {
        imap.search(
          [
            ['FROM', 'suporte@betano.com'],
            ['TEXT', 'Para ativar a conta']
          ],
          (err2, results) => {
            if (err2) throw new Error('');
            if (results.length > 0) {
              lastMatch = results[results.length - 1];

              const fetch = imap.fetch([lastMatch], { bodies: '' });

              fetch.on('message', (msg) => {
                msg.on('body', (stream) => {
                  let buffer = '';

                  stream.on('data', (chunk) => {
                    buffer += chunk.toString('utf8');
                  });

                  stream.on('end', () => {
                    const regex = /<strong(?:\s+[^>]*)?>(?<temp1>.*?)<\/strong>/gu;

                    const filtered: string[] = [];

                    buffer.replace(regex, (match2, conteudo) => {
                      filtered.push(conteudo);

                      return conteudo;
                    });

                    filtered.forEach((item) => {
                      if (!item?.startsWith('R$')) emails.push(item);
                    });
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
          if (functionalityId)
            await DataSource.action.create({
              data: {
                data: {
                  email,
                  senha: password
                },
                functionalityId,
                hasError: false,
                result: emails,
                userId: request.user.id
              }
            });

          return ok({ payload: emails, response });
        }

        if (functionalityId)
          await DataSource.action.create({
            data: {
              data: {
                email,
                senha: password
              },
              functionalityId,
              hasError: true,
              result: ['E-mail não encontrado'],
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
