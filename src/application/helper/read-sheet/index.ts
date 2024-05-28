import { google } from 'googleapis'; 

export interface functionToExecProps {
  email: string;
  password: string;
  functionalityId: number;
}

export interface readGoogleSheetProps {
  sheetId: string;
  email: string;
  password: string;
  sheetName: string;
  startRow: number;
  endRow: number;
  resultColumn: string;
  functionalityId: number;
  functionToExec: ({ email, password, functionalityId }: functionToExecProps) => string[];
}

export const readGoogleSheet = async ({
  endRow,
  sheetName,
  email,
  functionToExec,
  password,
  functionalityId,
  sheetId,
  resultColumn,
  startRow
}: readGoogleSheetProps): Promise<void> => {
  const range = `'${sheetName}'!${email}${startRow}:${password}${endRow}`;

  const auth = new google.auth.GoogleAuth({
    credentials:{},
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({
    auth,
    version: 'v4'
  });

  const response = await sheets.spreadsheets.values.get({
    range,
    spreadsheetId: sheetId
  });

  const rows = response.data.values;

  if (typeof rows?.length === 'number' && rows?.length > 0)
    rows.forEach((row, rowIndex): void => {
      const value = functionToExec({ email: row[0], functionalityId, password: row[1] });

      rows[rowIndex] = value;
    });

  const splitColumn = resultColumn.split(':');
  const startColumn = splitColumn[0];
  const endColumn = splitColumn[splitColumn.length - 1];

  const updateRange = `'${sheetName}'!${startColumn}${startRow}:${endColumn}${endRow}`;

  await sheets.spreadsheets.values.update({
    range: updateRange,
    requestBody: {
      values: rows
    },
    spreadsheetId: sheetId,
    valueInputOption: 'RAW'
  });
};
