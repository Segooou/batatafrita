/* eslint-disable id-length */
import { defaultFolder } from '../default-folder';
import { writeFileSync } from 'fs';

interface textToPdfProps {
  fileName: string;
  text: string;
}

export const textToTxt = ({ fileName, text }: textToPdfProps): void => {
  const utf8Text = Buffer.from(text, 'utf-8').toString('utf-8');

  writeFileSync(defaultFolder(fileName), utf8Text, 'utf-8');
};
