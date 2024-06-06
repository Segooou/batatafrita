import { Router } from 'express';
import { cnhImageController } from '../../../application/controller/image';

export const ImageRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/cnh', cnhImageController());

  inputRouter.use('/image', router);
};
