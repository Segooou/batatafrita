import { Router } from 'express';
import {
  stakeFirstAccessController,
  stakeLoginCodeController
} from '../../../application/controller/stake';

export const StakeRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/first-access', stakeFirstAccessController());
  router.post('/login-code', stakeLoginCodeController());

  inputRouter.use('/stake', router);
};
