/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable max-nested-callbacks */
import Imap from 'imap';

export interface OnFindEmailProps {
  buffer: string;
  emails: string[];
}

export interface OnEndProps {
  emails: string[];
}

export interface findEmailProps {
  email: string;
  password: string;
  onError: (error: Error) => void;
  onFindEmail: ({ buffer, emails }: OnFindEmailProps) => void;
  onEnd: ({ emails }: OnEndProps) => void;
  from: string;
  subject?: string;
  text?: string;
}

export const findEmail = ({
  email,
  password,
  onEnd,
  onError,
  from,
  onFindEmail,
  subject,
  text
}: findEmailProps): string[] => {
  const imapConfig = {
    connTimeout: 999999999,
    host: 'outlook.office365.com',
    password,
    port: 993,
    tls: true,
    user: email
  };

  const mailboxesToSearch = ['JUNK', 'INBOX'];
  const emails: string[] = [];

  const imap = new Imap(imapConfig);

  let lastMatch;

  const FROM = ['FROM', from];
  const SUBJECT = ['SUBJECT', subject ?? ''];
  const TEXT = ['TEXT', text ?? ''];

  const searchEmail = (): void => {
    imap.search([FROM, SUBJECT, TEXT], (err, results) => {
      if (err instanceof Error) onError(err);

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
              onFindEmail({ buffer, emails });
            });
          });
        });

        fetch.once('end', () => {
          imap.closeBox(() => {
            searchNextMailbox();
          });
        });
      } else searchNextMailbox();
    });
  };

  const searchNextMailbox = (): void => {
    if (mailboxesToSearch.length > 0 && emails.length === 0) {
      const nextMailbox = mailboxesToSearch.shift();

      imap.openBox(nextMailbox!, true, (err, box) => {
        if (err instanceof Error) onError(err);

        if (box.messages.total > 0) searchEmail();
        else searchNextMailbox();
      });
    } else imap.end();
  };

  imap.once('ready', () => {
    const initialMailbox = mailboxesToSearch.shift();

    imap.openBox(initialMailbox!, true, (err, box) => {
      if (err instanceof Error) onError(err);

      if (box.messages.total > 0) searchEmail();
      else searchNextMailbox();
    });
  });

  imap.once('error', (err: Error) => {
    if (err instanceof Error) onError(err);
  });

  imap.once('end', () => {
    onEnd({ emails });
    return emails;
  });

  imap.connect();
};
