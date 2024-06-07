import { findImageAndResize, insertTexts } from '../image';
import type { Sharp } from 'sharp';

export interface generateCnhData {
  name: string;
  dateOfBirth: string;
  cpf: string;
  motherName: string;
  firstLicenseDate: string;
  issueDate: string;
  gender: string;
  expirationDate: string;
  localOfBirth: string;
  rg: string;
  registerNumber: string;
  genericNumber: string;
}

interface generateFrontImageProps {
  frontBackgroundSharp: Sharp;
  data: generateCnhData;
}

export const generateFrontImage = async ({
  frontBackgroundSharp,
  data: {
    cpf,
    gender,
    motherName,
    dateOfBirth,
    name,
    expirationDate,
    firstLicenseDate,
    genericNumber,
    issueDate,
    localOfBirth,
    registerNumber,
    rg
  }
}: generateFrontImageProps): Promise<Buffer> => {
  const frontSharp = (await findImageAndResize({
    folder: 'default',
    height: 430,
    image: 'front.png',
    isSharp: true,
    width: 580
  })) as Sharp;

  const personBuffer = (await findImageAndResize({
    folder:
      gender?.toLowerCase() === 'female' ||
      gender?.toLowerCase() === 'mulher' ||
      gender?.toLowerCase() === 'm'
        ? 'mulher'
        : 'homem',
    height: 185,
    width: 128
  })) as Buffer;

  const assignBuffer = (await findImageAndResize({
    folder: 'assinatura',
    height: 80,
    width: 160
  })) as Buffer;

  const maleText = insertTexts({
    height: 430,
    texts: [
      {
        left: 138,
        text: String(name).toUpperCase(),
        top: 131
      },
      {
        left: 495,
        text: String(firstLicenseDate).toUpperCase(),
        top: 139
      },
      {
        left: 300,
        text: String(dateOfBirth).toUpperCase(),
        top: 167
      },
      {
        left: 390,
        text: String(localOfBirth).toUpperCase(),
        top: 169
      },
      {
        left: 290,
        text: String(issueDate).toUpperCase(),
        top: 200
      },
      {
        left: 395,
        text: String(expirationDate).toUpperCase(),
        top: 200
      },
      {
        left: 286,
        text: String(rg).toUpperCase(),
        top: 232
      },
      {
        left: 287,
        text: String(cpf).toUpperCase(),
        top: 264
      },
      {
        left: 410,
        text: String(registerNumber).toUpperCase(),
        top: 265
      },
      {
        left: 285,
        text: String(motherName).toUpperCase(),
        top: 330
      },
      {
        font: 'Times New Roman',
        left: 90,
        rotate: 270,
        size: '30px',
        text: String(genericNumber).toUpperCase(),
        top: 320
      }
    ],
    width: 580
  });

  const frontBuffer = await frontSharp
    .composite([
      { input: maleText },
      { input: personBuffer, left: 115, top: 158 },
      { input: assignBuffer, left: 110, top: 340 }
    ])
    .toBuffer();

  const frontImage = await frontBackgroundSharp.composite([{ input: frontBuffer }]).toBuffer();

  return frontImage;
};
