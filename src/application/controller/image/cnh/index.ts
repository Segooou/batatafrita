/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable id-length */
/* eslint-disable consistent-return */
import { DataSource } from '../../../../infra/database';
import { badRequest, errorLogger, messageErrorResponse, ok } from '../../../../main/utils';
import { findImageAndResize, getImageDrive, insertTexts } from '../../../helper';
import { generateAzurePathJpeg, uploadFileToAzure } from '../../../../infra/azure-blob';
import { random } from '../../../../main/utils/random';
import type { Controller } from '../../../../domain/protocols';
import type { DataProps } from '../../../helper';
import type { Request, Response } from 'express';
import type { Sharp } from 'sharp';

export interface Body {
  name: string;
  gender: 'homem' | 'mulher';
  dateOfBirth: string;
  cpf: string;
  motherName: string;

  functionalityId: number;
}

/**
 * POST /image/cnh
 * @summary CNH image
 * @tags Image
 * @security BearerAuth
 * @example request - payload example
 * {
 *   "name": "Japones batata frita",
 *   "firstLicenseDate": "20/07/1998",
 *   "gender": "male",
 *   "dateOfBirth": "10/05/1970",
 *   "localOfBirth": "são paulo/sp",
 *   "issueDate": "25/02/2005",
 *   "expirationDate": "24/08/2032",
 *   "identity": "461245138",
 *   "cpf": "12545645265",
 *   "registerNumber": "156154234"
 * }
 * @param {EmailGoogleSheetsBody} request.body.required
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const cnhImageController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { cpf, dateOfBirth, gender, name } = request.body as Body;

      const driveId = await getImageDrive({
        folder: gender
      });

      const mainId = await getImageDrive({
        folder: 'main'
      });

      const backgroundDriveId = await getImageDrive({
        folder: 'background'
      });

      if (
        typeof driveId === 'boolean' ||
        typeof mainId === 'boolean' ||
        typeof backgroundDriveId === 'boolean'
      )
        return badRequest({
          message: {
            english: 'Error on find file on drive',
            portuguese: 'Error ao buscar arquivo no drive'
          },
          response
        });

      const backgroundSharp = (await findImageAndResize({
        height: 1500,
        imageDriveId: backgroundDriveId,
        isSharp: true,
        width: 1500
      })) as Sharp;

      const mainSharp = (await findImageAndResize({
        height: 430,
        imageDriveId: mainId,
        isSharp: true,
        width: 580
      })) as Sharp;

      const personBuffer = (await findImageAndResize({
        height: 185,
        imageDriveId: driveId,
        width: 128
      })) as Buffer;

      const maleText = insertTexts({
        height: 430,
        texts: [
          {
            left: 138,
            text: String(name).toLocaleUpperCase(),
            top: 131
          },
          {
            left: 495,
            text: String('firstLicenseDate').toLocaleUpperCase(),
            top: 139
          },
          {
            left: 300,
            text: String(dateOfBirth).toLocaleUpperCase(),
            top: 167
          },
          {
            left: 390,
            text: String('localOfBirth').toLocaleUpperCase(),
            top: 169
          },
          {
            left: 290,
            text: String('issueDate').toLocaleUpperCase(),
            top: 197
          },
          {
            left: 395,
            text: String('expirationDate').toLocaleUpperCase(),
            top: 201
          },
          {
            font: 13,
            left: 285,
            text: String(random().slice(0, 9)).toLocaleUpperCase(),
            top: 232
          },
          {
            left: 285,
            text: String(cpf).toLocaleUpperCase(),
            top: 262
          },
          {
            left: 410,
            text: String(random().slice(0, 10)).toLocaleUpperCase(),
            top: 265
          },
          {
            left: 410,
            text: String(random().slice(0, 10)).toLocaleUpperCase(),
            top: 265
          },
          {
            font: 'times new roman',
            left: 90,
            rotate: 270,
            size: 30,
            text: String(random().slice(0, 10)).toLocaleUpperCase(),
            top: 320
          }
        ],
        width: 580
      });

      const mainBuffer = await mainSharp
        .composite([{ input: maleText }, { input: personBuffer, left: 115, top: 158 }])
        .toBuffer();

      const maleUrl = generateAzurePathJpeg();

      const image = await backgroundSharp.composite([{ input: mainBuffer }]).toBuffer();

      await uploadFileToAzure({
        azurePath: maleUrl,
        image
      });

      await DataSource.action.createMany({
        data: [],
        skipDuplicates: true
      });

      const finalResults: DataProps[] = [];

      finalResults.push({
        data: {
          email: ' ',
          password: ' '
        },
        hasError: false,
        result: [maleUrl]
      });

      return ok({ payload: finalResults, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
