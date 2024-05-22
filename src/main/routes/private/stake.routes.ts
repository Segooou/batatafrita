import { Router } from 'express';
import { stakeFirstAccessController } from '../../../application/controller/stake';

export const StakeRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/first-access', stakeFirstAccessController());

  inputRouter.use('/stake', router);
};
