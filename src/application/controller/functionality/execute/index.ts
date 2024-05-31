/* eslint-disable max-statements */
/* eslint-disable consistent-return */
import { DataSource } from '../../../../infra/database';
import { errorLogger, messageErrorResponse, notFound } from '../../../../main/utils';
import { functionalityFindParams } from '../../../../data/search';
import { useFindEmail } from '../../../helper';
import type { Controller } from '../../../../domain/protocols';
import type { DataProps, OnFindEmailProps } from '../../../helper/find-email';
import type { Request, Response } from 'express';
import type { readGoogleSheetProps } from '../../../helper/read-sheet';

interface Body {
  email: string;
  password: string;
  functionalityId: number;
  googleSheets?: readGoogleSheetProps;
}

/**
 * POST /functionality/execute
 * @summary Execute a functionality
 * @tags Functionality
 * @security BearerAuth
 * @param {EmailGoogleSheetsBody} request.body.required
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const executeFunctionalityController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { functionalityId } = request.body as Body;

      const functionality = await DataSource.functionality.findUnique({
        select: functionalityFindParams(true),
        where: {
          id: functionalityId
        }
      });

      if (functionality === null || functionality.from === null)
        return notFound({
          entity: { english: 'Functionality', portuguese: 'Funcionalidade' },
          response
        });

      const { indexToGet, regex, from, subject, text, textToReplace, messageOnFind } =
        functionality;

      const finalResults: DataProps[] = [];

      const convertResult = (result: string): string => {
        switch (result) {
          case 'LOGIN failed.':
            return 'Erro ao fazer login';

          default:
            return result ?? 'Error';
        }
      };

      const messageNotFound =
        typeof functionality?.messageNotFound === 'string' &&
        functionality?.messageNotFound.length > 0
          ? functionality?.messageNotFound
          : 'Nenhum e-mail foi encontrado';

      const onFindEmail = ({ result, buffer }: OnFindEmailProps): void => {
        if (typeof messageOnFind === 'string' && messageOnFind.length > 0)
          result.push(messageOnFind);
        else if (typeof regex === 'string' && regex.length > 0) {
          const regexExp = new RegExp(regex, 'gu');

          const match = buffer.match(regexExp);

          if (indexToGet?.length > 0)
            indexToGet.forEach((index) => {
              let value = match?.[index];

              if (typeof value === 'string') {
                const textToReplaceFormatted = textToReplace as unknown as string[][];

                textToReplaceFormatted.forEach((replaceValue) => {
                  const replaceRegex = new RegExp(replaceValue[0], 'gu');

                  value = value?.replace(replaceRegex, replaceValue?.[1] ?? '');
                });
                result.push(value);
              } else result.push('Nenhum dado foi encontrado');
            });
          else
            match?.forEach((item) => {
              let value = item;

              if (typeof value === 'string') {
                const textToReplaceFormatted = textToReplace as unknown as string[][];

                textToReplaceFormatted.forEach((replaceValue) => {
                  const replaceRegex = new RegExp(replaceValue[0], 'gu');

                  value = value?.replace(replaceRegex, replaceValue?.[1] ?? '');
                });
                result.push(value);
              } else result.push('Nenhum dado foi encontrado');
            });
        } else result.push(buffer);
      };

      const onEnd = (data: DataProps): void => {
        let newResult: DataProps | undefined;

        if (data.hasError && typeof data.errorMessage === 'string') {
          newResult = { ...data, result: [convertResult(data.errorMessage)] };
          data.result.push(convertResult(data.errorMessage));
        } else if (data.result.length === 0) {
          newResult = { ...data, result: [messageNotFound] };
          data.result.push(messageNotFound);
        } else newResult = data;

        finalResults.push(newResult);
      };

      await useFindEmail({
        finalResults,
        from,
        onEnd,
        onFindEmail,
        request,
        response,
        subject,
        text
      });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
