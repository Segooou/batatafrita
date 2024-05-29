import { type DataProps, type OnFindEmailProps, findEmail } from '../find-email';
import { DataSource } from '../../../infra/database';
import { badRequest, ok } from '../../../main/utils';
import {
  type functionToExecProps,
  readGoogleSheet,
  type readGoogleSheetProps
} from '../read-sheet';

interface useFindEmailProps {
  request: any;
  response: any;
  from: string;
  finalResults: DataProps[];
  subject?: string[];
  text?: string[];
  onFindEmail: (data: OnFindEmailProps) => void;
  onEnd: (data: DataProps) => void;
}

interface Body {
  email: string;
  password: string;
  functionalityId: number;
  googleSheets?: readGoogleSheetProps;
}

export const useFindEmail = async ({
  request,
  response,
  from,
  subject,
  finalResults,
  text,
  onEnd,
  onFindEmail
}: useFindEmailProps): Promise<void> => {
  const { email, password, googleSheets, functionalityId } = request.body as unknown as Body;

  const finishFunction = async (): Promise<void> => {
    if (typeof functionalityId === 'number') {
      const data = finalResults.map((item) => ({
        data: item.data,
        functionalityId,
        result: item.result,
        userId: request.user.id
      }));

      await DataSource.action.createMany({
        data,
        skipDuplicates: true
      });
    }

    ok({ payload: finalResults, response });
    response.end();
  };

  const functionToExec = async (data: functionToExecProps): Promise<string[]> => {
    const res = await findEmail({
      email: data.email,
      from,
      onEnd,
      onFindEmail,
      password: data.password,
      subject,
      text
    });

    return res;
  };

  if (typeof googleSheets === 'undefined') {
    await functionToExec({ email, password });
    await finishFunction();
  } else if (Number(googleSheets.endRow) >= Number(googleSheets.startRow)) {
    await readGoogleSheet({
      ...googleSheets,
      functionToExec
    });
    await finishFunction();
  } else {
    badRequest({
      message: {
        english: 'Linha final tem que ser maior do que a inicial',
        portuguese: 'Linha final tem que ser maior do que a inicial'
      },
      response
    });
    response.end();
  }
};
