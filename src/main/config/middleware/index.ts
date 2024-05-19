import { bodyParser, contentType, staticFolder, staticRoute } from '../../middleware';
import type { Express } from 'express';

export const setupMiddleware = (app: Express): void => {
  app.use(bodyParser);
  app.use(contentType);
  app.use(staticRoute, staticFolder);
};
