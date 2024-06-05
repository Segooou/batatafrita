/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { testImageController } from '../../../application/controller/image';

export const TestRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.get('/', (req, res) => {
    res.json({
      message: 'Api running successfully (◡‿◡)'
    });
  });

  router.post('/image/test', testImageController());

  inputRouter.use('/', router);
};
