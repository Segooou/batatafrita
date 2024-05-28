/* eslint-disable @typescript-eslint/no-misused-promises */
import { google } from 'googleapis';
import credentials from './credentials.json';

export interface functionToExecProps {
  email: string;
  password: string;
}

export interface readGoogleSheetProps {
  spreadsheetId: string;
  sheetName: string;
  email: string;
  password: string;
  resultColumn: string;
  startRow: number;
  endRow: number;
  functionToExec: ({ email, password }: functionToExecProps) => Promise<string[]>;
}

export const readGoogleSheet = async ({
  endRow,
  sheetName,
  email,
  functionToExec,
  password,
  spreadsheetId,
  resultColumn,
  startRow
}: readGoogleSheetProps): Promise<void> => {
  const range = `'${sheetName}'!${email}${startRow}:${password}${endRow}`;

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({
    auth,
    version: 'v4'
  });

  const response = await sheets.spreadsheets.values.get({
    range,
    spreadsheetId
  });

  const rows = response.data.values;

  if (typeof rows?.length === 'number' && rows?.length > 0) {
    const results = await Promise.all(
      rows.map(async (row) => {
        const result = await functionToExec({
          email: row[0],
          password: row[1]
        });

        return result;
      })
    );

    const splitColumn = resultColumn.split(':');
    const startColumn = splitColumn[0];
    const endColumn = splitColumn[splitColumn.length - 1];

    const updateRange = `'${sheetName}'!${startColumn}${startRow}:${endColumn}${
      startRow + results.length - 1
    }`;

    await sheets.spreadsheets.values.update({
      range: updateRange,
      requestBody: {
        values: results
      },
      spreadsheetId,
      valueInputOption: 'RAW'
    });
  }
};
