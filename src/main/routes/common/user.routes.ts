import { Router } from 'express';
import { findOneUserController, updateUserController } from '../../../application/controller/user';

export const UserRoutesCommon = (inputRouter: Router): void => {
  const router = Router();

  router.get('/:id', findOneUserController());
  router.put('/:id', updateUserController());

  inputRouter.use('/user', router);
};
