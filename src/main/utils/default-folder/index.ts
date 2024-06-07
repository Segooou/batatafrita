import { readdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import type { Sharp } from 'sharp';

export const defaultFolder = (pathName: string): string => {
  const pathArray = pathName.split('/');
  const fileName = pathArray[pathArray.length - 1];

  return path.join(__dirname, '..', '..', '..', 'static', 'uploads', fileName);
};

interface getImageProps {
  folder: 'assinatura' | 'default' | 'fundo' | 'homem' | 'mulher';
  image: string;
}

export const getImage = ({ folder, image }: getImageProps): Sharp => {
  const imagePath = path.join(__dirname, '..', '..', '..', 'static', 'uploads', folder, image);

  const imageBuffer = sharp(imagePath);

  return imageBuffer;
};

type ImageCounters = Record<string, number>;

interface getNextImageProps {
  folder: 'assinatura' | 'default' | 'fundo' | 'homem' | 'mulher';
}

const imageCounters: ImageCounters = {};

export const getNextImage = async ({ folder }: getNextImageProps): Promise<sharp.Sharp> => {
  const folderPath = path.join(__dirname, '..', '..', '..', 'static', 'uploads', folder);

  // eslint-disable-next-line no-restricted-syntax
  if (!(folder in imageCounters)) imageCounters[folder] = 0;

  const files = await readdir(folderPath);

  const currentIndex = imageCounters[folder];

  const nextImagePath = path.join(
    folderPath,
    files[currentIndex >= files.length ? 0 : currentIndex]
  );

  imageCounters[folder] += 1;

  if (currentIndex >= files.length) imageCounters[folder] = 0;

  return sharp(nextImagePath);
};
