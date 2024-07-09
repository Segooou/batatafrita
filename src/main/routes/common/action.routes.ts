import { Router } from 'express';
import { findActionController } from '../../../application/controller/action';

export const ActionRoutesCommon = (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findActionController());

  inputRouter.use('/action', router);
};
