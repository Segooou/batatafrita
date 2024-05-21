import {
  ActionRoutes,
  FavoriteUserFunctionalityRoutes,
  FunctionalityRoutes,
  NewFunctionalityRoutes,
  PlatformRoutes,
  UserRoutes
} from '../../routes/private';
import { AuthRoutes, EmailRoutes, TestRoutes, UserPublicRoutes } from '../../routes/public';
import { Router } from 'express';
import { validateTokenMiddleware } from '../../middleware/validation';
import type { Express } from 'express';

export const setupRoutes = (app: Express): void => {
  const publicRouter = Router();
  const privateRouter = Router();

  // publicRouter
  AuthRoutes(publicRouter);
  TestRoutes(publicRouter);
  UserPublicRoutes(publicRouter);
  EmailRoutes(publicRouter);

  // privateRouter
  UserRoutes(privateRouter);
  ActionRoutes(privateRouter);
  PlatformRoutes(privateRouter);
  NewFunctionalityRoutes(privateRouter);
  FavoriteUserFunctionalityRoutes(privateRouter);
  FunctionalityRoutes(privateRouter);

  app.use(publicRouter);

  app.use(validateTokenMiddleware(), privateRouter);
};
