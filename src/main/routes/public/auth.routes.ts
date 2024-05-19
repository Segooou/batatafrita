import { Router } from 'express';
import { authenticateUserController } from '../../../application/controller/auth';

export const AuthRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/login', authenticateUserController());

  inputRouter.use('/', router);
};
