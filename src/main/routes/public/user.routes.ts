import { Router } from 'express';
import { insertUserController } from '../../../application/controller/user';

export const UserPublicRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertUserController());

  inputRouter.use('/user', router);
};
