import { Router } from 'express';
import {
  stakeAccountBannedController,
  stakeFirstAccessController,
  stakeLoginCodeController
} from '../../../application/controller/stake';

export const StakeRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/first-access', stakeFirstAccessController());
  router.post('/login-code', stakeLoginCodeController());
  router.post('/account-banned', stakeAccountBannedController());

  inputRouter.use('/stake', router);
};
