/* eslint-disable max-lines */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable id-length */
/* eslint-disable no-plusplus */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable no-undefined */
import { createCanvas } from 'canvas';
import { getImage, getNextImage } from '../../../main/utils';
import sharp from 'sharp';
import type { OverlayOptions, Sharp } from 'sharp';

interface findImageAndResizeProps {
  folder: 'assinatura' | 'default' | 'fundo' | 'homem' | 'mulher';
  image?: 'back.png' | 'front.png';
  isSharp?: boolean;
  bluer?: boolean;
  width: number;
  height: number;
}

export const findImageAndResize = async ({
  height,
  isSharp,
  folder,
  bluer,
  image,
  width
}: findImageAndResizeProps): Promise<Buffer | Sharp | boolean> => {
  let sharpImage;

  if (typeof image === 'string') sharpImage = getImage({ folder, image });
  else sharpImage = await getNextImage({ folder });

  if (typeof sharpImage === 'undefined') return false;

  const contrast = 1;
  const brightness = 0.7;

  const resizableImage = await sharpImage
    .resize(
      isSharp === true ? width : { background: 'transparent', fit: 'contain', height, width },
      isSharp === true ? height : undefined
    )
    .linear(contrast, -(128 * contrast) + 128)
    .modulate({ brightness })
    .blur(bluer === true ? 1.5 : 1)
    .toBuffer();

  if (isSharp === true) {
    const finalImage = sharp(resizableImage);

    return finalImage;
  }

  return resizableImage;
};

interface findBackgroundProps {
  url: string;
}

export const findBackground = async ({ url }: findBackgroundProps): Promise<Sharp> => {
  const image = await (await fetch(url)).arrayBuffer();

  const finalImage = sharp(image);

  return finalImage;
};

interface findImageAndResizeProps2 {
  imageDriveId: string;
  isSharp?: boolean;
  width: number;
  height: number;
}
export const findImageAndResize2 = async ({
  imageDriveId,
  height,
  isSharp,
  width
}: findImageAndResizeProps2): Promise<Buffer | Sharp[]> => {
  const fetchImageResponse = await fetch(
    `https://drive.google.com/uc?export=download&id=${imageDriveId}`
  );
  const imageBuffer = await fetchImageResponse.arrayBuffer();

  const sharpImage = sharp(Buffer.from(imageBuffer));
  const resizableImage = await sharpImage
    .resize(
      isSharp === true ? width : { background: 'transparent', fit: 'contain', height, width },
      isSharp === true ? height : undefined
    )
    .toBuffer();

  if (isSharp === true) {
    const finalImage1 = sharp(resizableImage);
    const finalImage2 = sharp(resizableImage);

    return [finalImage1, finalImage2];
  }

  return resizableImage;
};

let getAssinaturaFontCount = 0;

const getAssinaturaFont = (): string => {
  const assinaturaArray = [
    'Homemade Apple',
    'Satisfy',
    'Dancing Script',
    'Allura',
    'Great Vibes',
    'Sacramento'
  ];

  if (assinaturaArray.length > getAssinaturaFontCount) {
    getAssinaturaFontCount += 1;
    return assinaturaArray[getAssinaturaFontCount - 1];
  }

  getAssinaturaFontCount = 0;
  return 'Homemade Apple';
};

export interface inputOnImageProps {
  value: string;
  text: string;
  top: number;
  left: number;
  height: number;
  width: number;
  folder?: 'assinatura' | 'homem' | 'mulher';
  size?: string;
  bold?: string;
  font?: string;
  rotate?: number;
  color?: string;
}

interface insertInputsOnImageProps {
  blackImage: Sharp;
  data: any;
  inputOnImage: inputOnImageProps[];
}

export const insertInputsOnImage = async ({
  blackImage,
  data,
  inputOnImage
}: insertInputsOnImageProps): Promise<Buffer> => {
  const images: OverlayOptions[] = [];
  const text: OverlayOptions[] = [];

  const insertImages: Array<Required<inputOnImageProps>> = [];
  const insertText: inputOnImageProps[] = [];

  inputOnImage?.forEach((item) => {
    if (typeof item.folder === 'string')
      insertImages.push({
        ...(item as Required<inputOnImageProps>),
        folder: data.gender
      });
    else if (item.value === 'assinatura') {
      const font = getAssinaturaFont();

      insertText.push({
        ...item,
        font,
        size:
          font === 'Homemade Apple' ? String(Number(item.size?.replace('px', '')) - 6) : item.size,
        text: data?.[item.value as 'name'] ?? ' '
      });
    } else
      insertText.push({
        ...item,
        text: data?.[item.value as 'name'] ?? ' '
      });
  });

  const promises = insertImages?.map(async (item) => {
    const imageBuffer = (await findImageAndResize({
      bluer: item.folder !== 'assinatura',
      folder: item.folder,
      height: item.height,
      width: item.width
    })) as Buffer;

    images.push({ input: imageBuffer, left: item.left, top: item.top });
    return '';
  });

  await Promise.all(promises);

  const metadata = await blackImage.metadata();

  const textCanvas = insertTexts({
    height: metadata.height ?? 1200,
    texts: insertText,
    width: metadata.width ?? 1200
  });

  text.push({ input: textCanvas });

  const mainBuffer = await blackImage.composite([...text, ...images]).toBuffer();

  return mainBuffer;
};

interface insertTextProps {
  texts: Array<{
    text: string;
    top: number;
    left: number;
    size?: string;
    font?: string;
    rotate?: number;
    color?: string;
    bold?: string;
    value?: string;
  }>;
  width: number;
  height: number;
}

export const insertTexts = ({ texts, height, width }: insertTextProps): Buffer => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  texts.forEach((item) => {
    ctx.save();

    const size = Number(item.size ?? 12);

    ctx.fillStyle = item.color ?? 'black';
    ctx.font = `${item.bold ?? ''} ${size}px ${item.font ?? 'Arial'}`;

    const rotate = item.rotate ?? 1;

    const angle = Number(rotate * Math.PI) / 180;

    ctx.translate(item.left, item.top + 10);
    ctx.rotate(angle);
    const text =
      item.value === 'assinatura'
        ? String(item.text ?? ' ')
        : String(item.text ?? ' ').toUpperCase();

    ctx.fillText(text, 0, 0);

    ctx.restore();
  });

  const applyBlur = (ctx: any, width: any, height: any, radius: any): void => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const { data } = imageData;

    const gaussianBlur = (data: any, width: any, height: any, radius: any): void => {
      const weights = [];
      const sigma = radius / 3;
      let sum = 0;

      for (let y = -radius; y <= radius; y++)
        for (let x = -radius; x <= radius; x++) {
          const weight = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));

          weights.push(weight);
          sum += weight;
        }

      for (let i = 0; i < weights.length; i++) weights[i] /= sum;

      const copy = new Uint8ClampedArray(data);

      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          const r = [0, 0, 0, 0];
          let totalWeight = 0;

          for (let wy = -radius; wy <= radius; wy++)
            for (let wx = -radius; wx <= radius; wx++) {
              const iy = Math.min(height - 1, Math.max(0, y + wy));
              const ix = Math.min(width - 1, Math.max(0, x + wx));
              const weight = weights[(wy + radius) * (2 * radius + 1) + (wx + radius)];

              const index = (iy * width + ix) * 4;

              r[0] += copy[index] * weight;
              r[1] += copy[index + 1] * weight;
              r[2] += copy[index + 2] * weight;
              r[3] += copy[index + 3] * weight;

              totalWeight += weight;
            }

          const index = (y * width + x) * 4;

          data[index] = r[0] / totalWeight;
          data[index + 1] = r[1] / totalWeight;
          data[index + 2] = r[2] / totalWeight;
          data[index + 3] = r[3] / totalWeight;
        }
    };

    gaussianBlur(data, width, height, radius);

    ctx.putImageData(imageData, 0, 0);
  };

  applyBlur(ctx, canvas.width, canvas.height, 2);

  const textBuffer = canvas.toBuffer();

  return textBuffer;
};
