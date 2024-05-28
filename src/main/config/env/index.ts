import 'dotenv/config';

export const env = {
  API_PORT: String(process.env.API_PORT),
  DATABASE_URL: String(process.env.DATABASE_URL),
  HASH_SALT: Number(process.env.HASH_SALT),
  JWT: {
    EXPIRES_IN: String(process.env.JWT_EXPIRES_IN),
    SECRET: String(process.env.JWT_SECRET)
  },
  credentials: {
    auth_provider_x509_cert_url: String(process.env.AUTH_PROVIDER_X509_CERT_URL),
    auth_uri: String(process.env.AUTH_URI),
    client_email: String(process.env.CLIENT_EMAIL),
    client_id: String(process.env.CLIENT_ID),
    client_x509_cert_url: String(process.env.CLIENT_X509_CERT_URL),
    private_key: String(process.env.PRIVATE_KEY).replace(/\\n/gmu, '\n'),
    private_key_id: String(process.env.PRIVATE_KEY_ID),
    project_id: String(process.env.PROJECT_ID),
    token_uri: String(process.env.TOKEN_URI),
    type: String(process.env.TYPE),
    universe_domain: String(process.env.UNIVERSE_DOMAIN)
  }
};
