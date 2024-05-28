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

export interface dataProps {
  data: {
    email: string;
    password: string;
  };
  result: string[];
}

export interface OnEndProps extends dataProps {
  hasError: boolean;
}

export interface findEmailProps {
  email: string;
  password: string;
  onError: ({ data, result }: dataProps) => void;
  onEnd: ({ data, result }: OnEndProps) => void;
  onFindEmail: ({ buffer, result }: OnFindEmailProps) => void;
  from: string;
  subject?: string;
  text?: string;
}

export const findEmail = async ({
  email,
  password,
  onEnd,
  onError,
  from,
  onFindEmail,
  subject,
  text
}: findEmailProps): Promise<string[]> => {
  const imapConfig = {
    connTimeout: 999999999,
    host: 'outlook.office365.com',
    password,
    port: 993,
    tls: true,
    user: email
  };

  let hasError = false;

  const data = {
    email,
    password
  };

  const mailboxesToSearch = ['JUNK', 'INBOX'];
  const result: string[] = [];

  const imap = new Imap(imapConfig);

  let lastMatch: number | undefined;

  const FROM = ['FROM', from];
  const SUBJECT = ['SUBJECT', subject ?? '*'];
  const TEXT = ['TEXT', text ?? '*'];

  const searchEmail = async (): Promise<void> => {
    await new Promise<void>((resolve) => {
      imap.search([FROM, SUBJECT, TEXT], (err, results) => {
        if (err instanceof Error) {
          console.info('1', err);
          hasError = true;
          onError({ data, result: [err?.message] });
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

      await new Promise<void>((resolve, reject) => {
        imap.openBox(nextMailbox, true, (err, box) => {
          if (err instanceof Error) {
            console.info('2', err);
            hasError = true;
            onError({ data, result: [err?.message] });
            imap.end();
          }

          if (box.messages.total > 0) searchEmail().then(resolve).catch(reject);
          else resolve();
        });
      });
    }
  };

  return await new Promise<string[]>((resolve, reject) => {
    imap.once('ready', () => {
      const initialMailbox = mailboxesToSearch.shift();

      imap.openBox(initialMailbox!, true, (err, box) => {
        if (err instanceof Error) {
          console.info('3', err);
          hasError = true;
          onError({ data, result: [err?.message] });
          imap.end();
        }

        if (box.messages.total > 0)
          searchEmail()
            .then(searchNextMailbox)
            .then(() => {
              imap.end();
            })
            .catch(reject);
        else
          searchNextMailbox()
            .then(() => {
              imap.end();
            })
            .catch(reject);
      });
    });

    imap.once('error', (err: Error) => {
      console.info('4', err);
      hasError = true;
      onError({ data, result: [err?.message] });
      imap.end();
    });

    imap.once('end', () => {
      onEnd({ data, hasError, result });
      resolve(result);
    });

    imap.connect();
  });
};
