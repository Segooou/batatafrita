/* eslint-disable id-length */
import { PDFDocument, rgb } from 'pdf-lib';
import { writeFileSync } from 'fs';

interface textToPdfProps {
  fileName: string;
  text: string;
}

export const textToPdf = async ({ fileName, text }: textToPdfProps): Promise<void> => {
  const pdfDoc = await PDFDocument.create();

  const margin = 20;
  const pageHeight = 800;

  let currentPage = pdfDoc.addPage();
  let currentTextHeight = pageHeight - margin;

  const lines = text.split('\n');

  for (const line of lines) {
    if (currentTextHeight - 12 < 0) {
      currentPage = pdfDoc.addPage();
      currentTextHeight = pageHeight - margin;
    }
    currentTextHeight -= 12;
    currentPage.drawText(line, {
      color: rgb(0, 0, 0),
      lineHeight: 11.5,
      maxWidth: 550,
      size: 12,
      x: margin,
      y: currentTextHeight + 25
    });
  }

  const pdfBytes = await pdfDoc.save();

  writeFileSync(fileName, pdfBytes);
};
