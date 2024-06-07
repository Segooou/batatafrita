import { findImageAndResize, insertTexts } from '../image';
import type { Sharp } from 'sharp';

interface generateCnhData {
  dateOfBirth: string;
  localOfBirth: string;
  genericNumber: string;
}

interface generateFrontImageProps {
  backBackgroundSharp: Sharp;
  data: generateCnhData;
}

export const generateBackImage = async ({
  backBackgroundSharp,
  data: { dateOfBirth, genericNumber, localOfBirth }
}: generateFrontImageProps): Promise<Buffer> => {
  const backSharp = (await findImageAndResize({
    folder: 'default',
    height: 419,
    image: 'back.png',
    isSharp: true,
    width: 595
  })) as Sharp;

  const text = insertTexts({
    height: 419,
    texts: [
      {
        font: 6,
        left: 254,
        size: '9px',
        text: String(dateOfBirth).toUpperCase(),
        top: 89
      },
      {
        left: 130,
        text: String(localOfBirth).toUpperCase(),
        top: 316
      },
      {
        font: 'times new roman',
        left: 90,
        rotate: 270,
        size: '30px',
        text: String(genericNumber).toUpperCase(),
        top: 355
      }
    ],
    width: 595
  });

  const backBuffer = await backSharp.composite([{ input: text }]).toBuffer();

  const backImage = await backBackgroundSharp.composite([{ input: backBuffer }]).toBuffer();

  return backImage;
};
