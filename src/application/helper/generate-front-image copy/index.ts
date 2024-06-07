import { findImageAndResize2, insertTexts } from '../image';
import type { Sharp } from 'sharp';

export interface generateCnhData {
  name: string;
  dateOfBirth: string;
  cpf: string;
  motherName: string;
  firstLicenseDate: string;
  issueDate: string;
  expirationDate: string;
  localOfBirth: string;
  rg: string;
  registerNumber: string;
  genericNumber: string;
}

interface generateFrontImageProps {
  frontBackgroundSharp: Sharp;
  faceId: string;
  data: generateCnhData;
}

export const generateFrontImage = async ({
  frontBackgroundSharp,
  faceId,
  data: {
    cpf,
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
  const [frontSharp] = (await findImageAndResize2({
    height: 430,
    imageDriveId: '18r0ud73Cbl2b4U-wv2d1oPXAd81Pifjm',
    isSharp: true,
    width: 580
  })) as Sharp[];

  const personBuffer = (await findImageAndResize2({
    height: 185,
    imageDriveId: faceId,
    width: 128
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
        top: 197
      },
      {
        left: 395,
        text: String(expirationDate).toUpperCase(),
        top: 201
      },
      {
        left: 290,
        text: String(rg).toUpperCase(),
        top: 232
      },
      {
        left: 285,
        text: String(cpf).toUpperCase(),
        top: 262
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
        font: 'times new roman',
        left: 90,
        rotate: 270,
        size: 30,
        text: String(genericNumber).toUpperCase(),
        top: 320
      }
    ],
    width: 580
  });

  const frontBuffer = await frontSharp
    .composite([{ input: maleText }, { input: personBuffer, left: 115, top: 158 }])
    .toBuffer();

  const frontImage = await frontBackgroundSharp.composite([{ input: frontBuffer }]).toBuffer();

  return frontImage;
};
