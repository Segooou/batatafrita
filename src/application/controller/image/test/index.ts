/* eslint-disable max-statements */
/* eslint-disable id-length */
/* eslint-disable consistent-return */
import { badRequest, errorLogger, messageErrorResponse, ok } from '../../../../main/utils';
import { findImageAndResize, getImageDrive, insertTexts } from '../../../helper';
import { generateAzurePathJpeg, uploadFileToAzure } from '../../../../infra/azure-blob';
import type { Controller } from '../../../../domain/protocols';
import type { Request, Response } from 'express';
import type { Sharp } from 'sharp';
import type { readGoogleSheetProps } from '../../../helper/read-sheet';

export interface Body {
  email: string;
  password: string;
  functionalityId: number;
  googleSheets?: readGoogleSheetProps;
}

/**
 * POST /image/test
 * @summary Test image
 * @tags AAAA
 * @param {EmailGoogleSheetsBody} request.body.required
 * @return {DefaultResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const testImageController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const mainWidth = 800;
      const mainHeight = 800;

      const backgroundDriveId = await getImageDrive({
        folder: 'background'
      });
      const maleDriveId = await getImageDrive({
        folder: 'male'
      });
      const femaleDriveId = await getImageDrive({
        folder: 'female'
      });

      if (
        typeof backgroundDriveId === 'boolean' ||
        typeof maleDriveId === 'boolean' ||
        typeof femaleDriveId === 'boolean'
      )
        return badRequest({
          message: {
            english: 'Error on find file on drive',
            portuguese: 'Error ao buscar arquivo no drive'
          },
          response
        });

      const backgroundSharp = (await findImageAndResize({
        height: mainHeight,
        imageDriveId: backgroundDriveId,
        isSharp: true,
        width: mainWidth
      })) as Sharp;

      const maleBuffer = (await findImageAndResize({
        height: 500,
        imageDriveId: maleDriveId,
        width: 500
      })) as Buffer;

      const maleText = insertTexts({
        height: mainHeight,
        texts: [
          {
            left: 50,
            text: 'palavra ou locução com que se designa uma classe de coisas',
            top: 50
          }
        ],
        width: mainWidth
      });

      const maleImage = await backgroundSharp
        .composite([{ input: maleBuffer }, { input: maleText }])
        .toBuffer();

      const maleUrl = generateAzurePathJpeg();

      await uploadFileToAzure({
        azurePath: maleUrl,
        image: maleImage
      });

      const femaleBuffer = (await findImageAndResize({
        height: 500,
        imageDriveId: femaleDriveId,
        width: 500
      })) as Buffer;

      const femaleText = insertTexts({
        height: mainHeight,
        texts: [
          {
            left: 50,
            text: 'palavra ou locução com que se designa uma classe de coisas',
            top: 50
          }
        ],
        width: mainWidth
      });

      const femaleImage = await backgroundSharp
        .composite([{ input: femaleBuffer }, { input: femaleText }])
        .toBuffer();

      const femaleUrl = generateAzurePathJpeg();

      await uploadFileToAzure({
        azurePath: femaleUrl,
        image: femaleImage
      });

      return ok({ payload: { femaleUrl, maleUrl }, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
