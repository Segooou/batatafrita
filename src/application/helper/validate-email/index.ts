/* eslint-disable no-return-await */
import Imap from 'imap';
import type { DataProps } from '../find-email';

export interface validateEmailProps {
  email: string;
  password: string;
  onEnd: (data: DataProps) => void;
  onFindEmail: (data: DataProps) => void;
}

export const validateEmail = async ({
  email,
  password,
  onEnd,
  onFindEmail
}: validateEmailProps): Promise<string[]> => {
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

  const result: string[] = [];

  let hasError = false;
  let errorMessage = '';

  const imap = new Imap(imapConfig);

  await new Promise(() => {
    imap.once('ready', () => {
      onFindEmail({ data, errorMessage, hasError, result });
      imap.end();
    });

    imap.once('error', (err: Error) => {
      hasError = true;
      errorMessage = err?.message;
      imap.end();
    });

    imap.once('end', () => {
      onEnd({ data, errorMessage, hasError, result });
    });

    imap.connect();
  });

  return result;
};
