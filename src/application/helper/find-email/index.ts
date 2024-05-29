/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-return-await */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable max-nested-callbacks */
import Imap from 'imap';

export interface OnFindEmailProps {
  buffer: string;
  result: string[];
}

export interface DataProps {
  data: {
    email: string;
    password: string;
  };
  result: string[];
  hasError: boolean;
  errorMessage?: string;
}

export interface findEmailProps {
  email: string;
  password: string;
  onEnd: (data: DataProps) => void;
  onFindEmail: (data: OnFindEmailProps) => void;
  from: string;
  subject?: string;
  text?: string;
}

export const findEmail = async ({
  email,
  password,
  onEnd,
  from,
  onFindEmail,
  subject,
  text
}: findEmailProps): Promise<string[]> => {
  const imapConfig = {
    authTimeout: 60000,
    connTimeout: 60000,
    host: 'outlook.office365.com',
    password,
    port: 993,
    tls: true,
    user: email
  };

  const data = {
    email,
    password
  };

  const mailboxesToSearch = ['JUNK', 'INBOX'];
  const result: string[] = [];

  const imap = new Imap(imapConfig);

  let lastMatch: number | undefined;

  let hasError = false;
  let errorMessage = '';

  const FROM = ['FROM', from];
  const SUBJECT = ['SUBJECT', subject ?? '*'];
  const TEXT = ['TEXT', text ?? '*'];

  const searchEmail = async (): Promise<void> => {
    await new Promise<void>((resolve) => {
      imap.search([FROM, SUBJECT, TEXT], (err, results) => {
        if (err instanceof Error) {
          hasError = true;
          errorMessage = err?.message;
          imap.end();
        }

        if (results.length > 0) {
          lastMatch = results[results.length - 1];

          const fetch = imap.fetch([lastMatch], { bodies: '' });

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              let buffer = '';

              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });

              stream.on('end', () => {
                onFindEmail({ buffer, result });
              });
            });
          });

          fetch.once('end', () => {
            imap.closeBox(() => {
              resolve();
            });
          });
        } else resolve();
      });
    });
  };

  const searchNextMailbox = async (): Promise<void> => {
    while (mailboxesToSearch.length > 0 && result.length === 0) {
      const nextMailbox = mailboxesToSearch.shift();

      if (typeof nextMailbox === 'undefined') break;

      await new Promise<void>((resolve) => {
        imap.openBox(nextMailbox, true, (err, box) => {
          if (err instanceof Error) {
            hasError = true;
            errorMessage = err?.message;
            imap.end();
          }

          if (box.messages.total > 0)
            searchEmail()
              .then(resolve)
              .catch((err2: Error) => {
                hasError = true;
                errorMessage = err2?.message;
                imap.end();
              });
          else resolve();
        });
      });
    }
  };

  return await new Promise<string[]>((resolve) => {
    imap.once('ready', () => {
      const initialMailbox = mailboxesToSearch.shift();

      imap.openBox(initialMailbox!, true, (err, box) => {
        if (err instanceof Error) {
          hasError = true;
          errorMessage = err?.message;
          imap.end();
        }

        if (box.messages.total > 0)
          searchEmail()
            .then(searchNextMailbox)
            .then(() => {
              imap.end();
            })
            .catch((err2: Error) => {
              hasError = true;
              errorMessage = err2?.message;
              imap.end();
            });
        else
          searchNextMailbox()
            .then(() => {
              imap.end();
            })
            .catch((err2: Error) => {
              hasError = true;
              errorMessage = err2?.message;
              imap.end();
            });
      });
    });

    imap.once('error', (err: Error) => {
      hasError = true;
      errorMessage = err?.message;
    });

    imap.once('end', () => {
      onEnd({ data, errorMessage, hasError, result });
      resolve(result);
    });

    imap.connect();
  });
};
