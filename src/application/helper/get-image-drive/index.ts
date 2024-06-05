/* eslint-disable max-statements */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable id-length */
import { google } from 'googleapis';
import credentials from '../credentials/index.json';

export interface getImageDriveProps {
  folder: 'background' | 'female' | 'male';
}

let maleCount = 0;
let femaleCount = 0;
let backgroundCount = 0;

export const getImageDrive = async ({ folder }: getImageDriveProps): Promise<boolean | string> => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
  });

  const drive = google.drive({ auth, version: 'v3' });

  const maleFolderId = '1qs2MZ8H_dZ-3OU4oXGGEZ89jVT7OiAJ-';
  const femaleFolderId = '10DjfNIqT_b9v93Wl6IbO5OLDMWD7xzwf';
  const backgroundFolderId = '1hIhgUiKH7bEDqw8JJy6Dy6nrqf9rStuk';

  const getFolderId = (): string => {
    switch (folder) {
      case 'male':
        return maleFolderId;

      case 'female':
        return femaleFolderId;

      case 'background':
        return backgroundFolderId;

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
    if (folder === 'male')
      if (files.length > maleCount) {
        const { id } = files?.[maleCount];

        maleCount += 1;
        if (typeof id === 'string') return id;
      } else {
        maleCount = 0;
        const { id } = files?.[0];

        if (typeof id === 'string') return id;
      }
    else if (folder === 'female')
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

  return false;
};
