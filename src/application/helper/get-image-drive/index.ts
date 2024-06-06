/* eslint-disable max-statements */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable id-length */
import { google } from 'googleapis';
import credentials from '../credentials/index.json';

export interface getImageDriveProps {
  folder: 'background' | 'homem' | 'main' | 'mulher';
}

let maleCount = 0;
let femaleCount = 0;
let backgroundCount = 0;

export const getImageDrive = async ({ folder }: getImageDriveProps): Promise<boolean | string> => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    const drive = google.drive({ auth, version: 'v3' });
    const mainFolderId = '19oFaLwYD6aJrjkojOoy3kU_VB8chtJy7';
    const maleFolderId = '1LeFXSVmUpigQ9CA88S13H7S2_-em6t3l';
    const femaleFolderId = '1IhzwaSibmZfj37F7TsFnxpyUkJHpPXLa';
    const backgroundFolderId = '1_dEvV__taaYUmwrDZ0CFxV86aRZNpCRx';

    const getFolderId = (): string => {
      switch (folder) {
        case 'homem':
          return maleFolderId;

        case 'mulher':
          return femaleFolderId;

        case 'background':
          return backgroundFolderId;

        case 'main':
          return mainFolderId;

        default:
          return '';
      }
    };

    const res = await drive.files.list({
      fields: 'files(id, name, webViewLink)',
      q: `'${getFolderId()}' in parents and mimeType contains 'image/'`
    });

    const { files } = res.data;

    if (typeof files?.length !== 'undefined' && files?.length > 0)
      if (folder === 'homem')
        if (files.length > maleCount) {
          const { id } = files?.[maleCount];

          maleCount += 1;
          if (typeof id === 'string') return id;
        } else {
          maleCount = 0;
          const { id } = files?.[0];

          if (typeof id === 'string') return id;
        }
      else if (folder === 'mulher')
        if (files.length > femaleCount) {
          const { id } = files?.[femaleCount];

          femaleCount += 1;
          if (typeof id === 'string') return id;
        } else {
          femaleCount = 0;
          const { id } = files?.[0];

          if (typeof id === 'string') return id;
        }
      else if (folder === 'background')
        if (files.length > backgroundCount) {
          const { id } = files?.[backgroundCount];

          backgroundCount += 1;
          if (typeof id === 'string') return id;
        } else {
          backgroundCount = 0;
          const { id } = files?.[0];

          if (typeof id === 'string') return id;
        }
      else if (folder === 'main') {
        const { id } = files?.[0];

        if (typeof id === 'string') return id;
      }

    return false;
  } catch {
    return false;
  }
};
