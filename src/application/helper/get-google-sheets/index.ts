/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { readGoogleSheetProps } from '../read-sheet';

export const getGoogleSheets = (
  query: any
): Pick<
  readGoogleSheetProps,
  'email' | 'endRow' | 'password' | 'resultColumn' | 'sheetName' | 'spreadsheetId' | 'startRow'
> => {
  return {
    email: String(query.email),
    endRow: Number(query.endRow),
    password: String(query.password),
    resultColumn: String(query.resultColumn),
    sheetName: String(query.sheetName),
    spreadsheetId: String(query.spreadsheetId),
    startRow: Number(query.startRow)
  };
};
