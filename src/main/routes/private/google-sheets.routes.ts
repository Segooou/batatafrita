import { Router } from 'express';
import { googleSheetsCheckEmailController } from '../../../application/controller/google-sheets';

export const GoogleSheetsRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/check-email', googleSheetsCheckEmailController());

  inputRouter.use('/google-sheets', router);
};
