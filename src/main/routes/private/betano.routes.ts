import { Router } from 'express';
import { betanoLoginCodeController } from '../../../application/controller/betano';

export const BetanoRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/login-code', betanoLoginCodeController());

  inputRouter.use('/betano', router);
};
