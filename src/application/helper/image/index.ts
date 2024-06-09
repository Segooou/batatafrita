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
  width: number;
  height: number;
}

export const findImageAndResize = async ({
  height,
  isSharp,
  folder,
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

export interface inputOnImageProps {
  value: string;
  text: string;
  top: number;
  left: number;
  height: number;
  width: number;
  folder?: 'assinatura' | 'homem' | 'mulher';
  size?: string;
  font?: string;
  rotate?: number;
  color?: string;
}

interface insertInputsOnImageProps {
  blackImage: Sharp;
  data: { name: string };
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
    if (typeof item.folder === 'string') insertImages.push(item as Required<inputOnImageProps>);
    insertText.push({ ...item, text: data?.[item.value as 'name'] ?? ' ' });
  });

  const promises = insertImages?.map(async (item) => {
    const imageBuffer = (await findImageAndResize({
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
    ctx.font = `${size}px ${item.font ?? 'Arial'}`;

    const rotate = item.rotate ?? 1;

    const angle = Number(rotate * Math.PI) / 180;

    ctx.translate(item.left, item.top + 10);
    ctx.rotate(angle);
    ctx.fillText(item.text?.toUpperCase(), 0, 0);

    ctx.restore();
  });

  const textBuffer = canvas.toBuffer();

  return textBuffer;
};
