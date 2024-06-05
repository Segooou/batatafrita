import 'dotenv/config';

export const env = {
  API_PORT: String(process.env.API_PORT),
  AZURE: {
    ACCOUNT_KEY: String(process.env.AZURE_ACCOUNT_KEY),
    ACCOUNT_NAME: String(process.env.AZURE_ACCOUNT_NAME),
    URL: String(process.env.AZURE_URL)
  },
  DATABASE_URL: String(process.env.DATABASE_URL),
  HASH_SALT: Number(process.env.HASH_SALT),
  JWT: {
    EXPIRES_IN: String(process.env.JWT_EXPIRES_IN),
    SECRET: String(process.env.JWT_SECRET)
  }
};
