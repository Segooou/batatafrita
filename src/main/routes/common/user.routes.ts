import { Router } from 'express';
import { findOneUserController } from '../../../application/controller/user';

export const UserRoutesCommon = (inputRouter: Router): void => {
  const router = Router();

  router.get('/:id', findOneUserController());

  inputRouter.use('/user', router);
};
