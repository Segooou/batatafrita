/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable id-length */
/* eslint-disable consistent-return */
import { DataSource } from '../../../../infra/database';
import {
  badRequest,
  convertToDate,
  errorLogger,
  getDateAddYears,
  getDateBetween,
  getDateSubtractYears,
  getOneLocale,
  isValidDate,
  messageErrorResponse,
  ok
} from '../../../../main/utils';
import { findImageAndResize, generateFrontImage, getImageDrive } from '../../../helper';
import { generateAzurePathJpeg, uploadFileToAzure } from '../../../../infra/azure-blob';
import { random } from '../../../../main/utils/random';
import type { Controller } from '../../../../domain/protocols';
import type { DataProps } from '../../../helper';
import type { Request, Response } from 'express';
import type { Sharp } from 'sharp';

export interface Body {
  name: string;
  gender: string;
  dateOfBirth: string;
  cpf: string;
  motherName: string;

  functionalityId: number;
  test?: boolean;
}

/**
 * POST /image/cnh
 * @summary CNH image
 * @tags Image
 * @security BearerAuth
 * @example request - payload example
 * {
 *   "name": "Japones batata frita",
 *   "gender": "homem",
 *   "dateOfBirth": "10/05/1970",
 *   "cpf": "125.456.452-65",
 *   "motherName": "Maria"
 * }
 * @param {EmailGoogleSheetsBody} request.body.required
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const cnhImageController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { cpf, dateOfBirth, gender, name, motherName, functionalityId, test } =
        request.body as Body;

      if (!isValidDate(dateOfBirth))
        return badRequest({
          message: {
            english: 'Invalid date of birth',
            portuguese: 'Data de aniversário inválida'
          },
          response
        });

      const firstLicenseDate = getDateAddYears({ addYears: 19, date: convertToDate(dateOfBirth) });
      const issueDate = getDateBetween({
        biggerThen: convertToDate(getDateSubtractYears({ date: new Date(), subtractYears: 3 })),
        lessThan: new Date()
      });
      const expirationDate = getDateAddYears({ addYears: 10, date: convertToDate(issueDate) });
      const localOfBirth = getOneLocale();
      const rg = random().slice(0, 9);
      const registerNumber = random().slice(0, 10);
      const genericNumber = random().slice(0, 10);

      const faceId = await getImageDrive({
        folder:
          gender?.toLowerCase() === 'female' ||
          gender?.toLowerCase() === 'mulher' ||
          gender?.toLowerCase() === 'm'
            ? 'mulher'
            : 'homem'
      });

      const backgroundDriveId = await getImageDrive({
        folder: 'background'
      });

      if (typeof faceId === 'boolean' || typeof backgroundDriveId === 'boolean')
        return badRequest({
          message: {
            english: 'Error on find file on drive',
            portuguese: 'Error ao buscar arquivo no drive'
          },
          response
        });

      const [frontBackgroundSharp] = (await findImageAndResize({
        height: 1500,
        imageDriveId: backgroundDriveId,
        isSharp: true,
        width: 1500
      })) as Sharp[];

      const frontDocumentUrl = generateAzurePathJpeg();

      const frontImage = await generateFrontImage({
        data: {
          cpf,
          dateOfBirth,
          expirationDate,
          firstLicenseDate,
          genericNumber,
          issueDate,
          localOfBirth,
          motherName,
          name,
          registerNumber,
          rg
        },
        faceId,
        frontBackgroundSharp
      });

      await uploadFileToAzure({
        azurePath: frontDocumentUrl,
        image: frontImage
      });

      const backDocumentUrl = generateAzurePathJpeg();

      const finalResults: DataProps[] = [];

      finalResults.push({
        data: {
          email: '',
          password: ''
        },
        hasError: false,
        result: [frontDocumentUrl, backDocumentUrl]
      });

      if (typeof functionalityId === 'number' && test !== true) {
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

      return ok({ payload: finalResults, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
