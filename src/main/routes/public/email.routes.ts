import { Router } from 'express';
import { insertEmailController } from '../../../application/controller/email';

export const EmailRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertEmailController());

  inputRouter.use('/email', router);
};
