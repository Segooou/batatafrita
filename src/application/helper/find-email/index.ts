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

export interface errorProps {
  error: string;
  result: string[];
}

export interface dataProps {
  data: {
    email: string;
    password: string;
  };
  result: string[];
}

export interface findEmailProps {
  email: string;
  password: string;
  onError: ({ error, result }: errorProps) => void;
  onEnd: ({ data, result }: dataProps) => void;
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
          onError({ error: err?.message, result });
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
            onError({ error: err?.message, result });
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
          onError({ error: err?.message, result });
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
      onError({ error: err?.message, result });
      resolve(result);
    });

    imap.once('end', () => {
      onEnd({ data, result });
      resolve(result);
    });

    imap.connect();
  });
};
