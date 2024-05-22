import { Router } from 'express';
import { findActionController } from '../../../application/controller/action';

export const ActionRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findActionController());

  inputRouter.use('/action', router);
};
