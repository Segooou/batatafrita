/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
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
    font?: number | string;
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
    ctx.fillStyle = item.color ?? 'black';
    ctx.font = `${item.size ?? 12}px ${item.font ?? 'Arial'}`;

    const rotate = item.rotate ?? 1;
    // Calcula o ângulo de inclinação em radianos (por exemplo, 10 graus)
    const angle = Number(rotate * Math.PI) / 180;

    // Aplica a transformação de rotação
    ctx.translate(item.left, item.top + 10);
    ctx.rotate(angle);
    ctx.fillText(item.text, 0, 0);

    ctx.restore();
  });

  const textBuffer = canvas.toBuffer();

  return textBuffer;
};
