/* eslint-disable max-statements */
import {
  ActionRoutes,
  BetanoRoutes,
  FavoriteUserFunctionalityRoutes,
  FunctionalityImageRoutes,
  FunctionalityRoutes,
  GoogleSheetsRoutes,
  ImageRoutes,
  NewFunctionalityRoutes,
  PlatformRoutes,
  StakeRoutes,
  UserFunctionalitiesRoutes,
  UserRoutes
} from '../../routes/private';
import {
  ActionRoutesCommon,
  FavoriteUserFunctionalityRoutesCommon,
  FunctionalityRoutesCommon,
  PlatformRoutesCommon,
  UserRoutesCommon
} from '../../routes/common';
import { AuthRoutes, TestRoutes, UserPublicRoutes } from '../../routes/public';
import { Router } from 'express';
import { validateTokenAdminMiddleware } from '../../middleware/validation-admin';
import { validateTokenMiddleware } from '../../middleware/validation';
import type { Express } from 'express';

export const setupRoutes = (app: Express): void => {
  const publicRouter = Router();
  const adminRouter = Router();
  const privateRouter = Router();

  // publicRouter
  AuthRoutes(publicRouter);
  TestRoutes(publicRouter);
  UserPublicRoutes(publicRouter);

  // adminRouter
  UserRoutes(adminRouter);
  ActionRoutes(adminRouter);
  PlatformRoutes(adminRouter);
  NewFunctionalityRoutes(adminRouter);
  FavoriteUserFunctionalityRoutes(adminRouter);
  FunctionalityRoutes(adminRouter);
  StakeRoutes(adminRouter);
  BetanoRoutes(adminRouter);
  GoogleSheetsRoutes(adminRouter);
  ImageRoutes(adminRouter);
  FunctionalityImageRoutes(adminRouter);
  UserFunctionalitiesRoutes(adminRouter);

  // privateRouter
  ActionRoutesCommon(privateRouter);
  FavoriteUserFunctionalityRoutesCommon(privateRouter);
  FunctionalityRoutesCommon(privateRouter);
  PlatformRoutesCommon(privateRouter);
  UserRoutesCommon(privateRouter);

  app.use(publicRouter);

  app.use(validateTokenMiddleware(), privateRouter);

  app.use(validateTokenAdminMiddleware(), adminRouter);
};
