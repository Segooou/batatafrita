/* eslint-disable max-statements */
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
import { findBackground, insertInputsOnImage } from '../../../helper';
import { functionalityImageFindParams } from '../../../../data/search';
import { generateAzurePathJpeg, uploadFileToAzure } from '../../../../infra/azure-blob';
import { random } from '../../../../main/utils/random';
import type { Controller } from '../../../../domain/protocols';
import type { DataProps, inputOnImageProps } from '../../../helper';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  gender: string;
  dateOfBirth: string;
  cpf: string;
  motherName: string;
  fatherName?: string;

  functionalityId: number;
  test?: boolean;
}

let position = 0;

/**
 * POST /image/cnh2
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
export const cnh2ImageController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { cpf, dateOfBirth, gender, name, motherName, fatherName, functionalityId, test } =
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
      const localOfBirth = getOneLocale().toUpperCase();
      const rg = `${random().slice(0, 9)} SSPSP`;
      const registerNumber = random().slice(0, 10);
      const genericNumber = random().slice(0, 10);
      const nationality = 'Brasileiro'.toUpperCase();
      const category = 'B';
      let assinatura = '';
      const separatedName = name.split(' ');

      separatedName.forEach((item, index) => {
        if (index === 0) assinatura = item;
        if (index === 1) assinatura = `${assinatura} ${item}`;
        if (index === 2 && separatedName[1].length === 2) assinatura = `${assinatura} ${item}`;
      });

      const data = {
        assinatura,
        category,
        cpf,
        dateOfBirth,
        expirationDate,
        fatherName,
        firstLicenseDate,
        functionalityId,
        gender,
        genericNumber,
        issueDate,
        localOfBirth,
        motherName,
        name,
        nationality,
        registerNumber,
        rg
      };

      const count = await DataSource.functionalityImage.count({
        where: { AND: { active: true, finishedAt: null, functionalityId } }
      });

      if (position >= count) position = 0;

      const functionalityImage = await DataSource.functionalityImage.findFirst({
        select: functionalityImageFindParams,
        skip: position >= count ? 0 : position,
        where: { AND: { active: true, finishedAt: null, functionalityId } }
      });

      position += 1;

      const finalResults: DataProps[] = [];

      if (
        typeof functionalityImage?.imagesOnFunctionality.length === 'undefined' ||
        functionalityImage?.imagesOnFunctionality.length === 0
      )
        return badRequest({
          message: { english: 'Error', portuguese: 'Erro ao buscar imagens' },
          response
        });

      const promises = functionalityImage?.imagesOnFunctionality?.map(async (item) => {
        const blackImage = await findBackground({ url: item.url });
        const finalImage = await insertInputsOnImage({
          blackImage,
          data,
          inputOnImage: item.inputOnImage as unknown as inputOnImageProps[]
        });
        const azureUrl = generateAzurePathJpeg();

        await uploadFileToAzure({
          azurePath: azureUrl,
          image: finalImage
        });
        return azureUrl;
      });

      const urls = await Promise.all(promises);

      finalResults.push({
        data: {
          email: '',
          password: ''
        },
        hasError: false,
        result: urls
      });

      if (typeof functionalityId === 'number' && test !== true) {
        const finalResultsData = finalResults.map((item) => ({
          data: item.data,
          functionalityId,
          result: item.result,
          userId: request.user.id
        }));

        await DataSource.action.createMany({
          data: finalResultsData,
          skipDuplicates: true
        });
      }

      await DataSource.images.createMany({
        data: urls?.map((item) => ({ url: item })),
        skipDuplicates: true
      });

      return ok({ payload: finalResults, response });
    } catch (error) {
      position -= 1;
      errorLogger(error);

      return messageErrorResponse({ error, response });
    }
  };
