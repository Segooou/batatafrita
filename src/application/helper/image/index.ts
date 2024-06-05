/* eslint-disable no-undefined */
import { createCanvas } from 'canvas';
import sharp from 'sharp';
import type { Sharp } from 'sharp';

interface findImageAndResizeProps {
  imageDriveId: string;
  isSharp?: boolean;
  width: number;
  height: number;
}

export const findImageAndResize = async ({
  imageDriveId,
  height,
  isSharp,
  width
}: findImageAndResizeProps): Promise<Buffer | Sharp> => {
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
    const finalImage = sharp(resizableImage);

    return finalImage;
  }

  return resizableImage;
};

interface insertTextProps {
  texts: Array<{
    text: string;
    top: number;
    left: number;
    size?: number;
    font?: string;
    color?: string;
  }>;
  width: number;
  height: number;
}

export const insertTexts = ({ texts, height, width }: insertTextProps): Buffer => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  texts.forEach((item) => {
    ctx.fillStyle = item.color ?? 'black';
    ctx.font = `${item.size ?? 50}px ${item.font ?? 'Arial'}`;
    ctx.fillText(item.text, item.left, item.top);
  });

  const textBuffer = canvas.toBuffer();

  return textBuffer;
};
