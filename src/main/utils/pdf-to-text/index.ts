import { readFileSync } from 'fs';
import pdf from 'pdf-parse';

export const pdfToText = async (filePath: string): Promise<string> => {
  const pdfBuffer = readFileSync(filePath);

  const data = await pdf(pdfBuffer);

  return data.text;
};
