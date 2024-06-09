import { Router } from 'express';
import { cnh2ImageController, cnhImageController } from '../../../application/controller/image';

export const ImageRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/cnh', cnhImageController());
  router.post('/cnh2', cnh2ImageController());

  inputRouter.use('/image', router);
};
