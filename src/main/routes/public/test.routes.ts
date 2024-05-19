/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';

export const TestRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.get('/', (req, res) => {
    res.json({
      message: 'Api running successfully (◡‿◡)'
    });
  });

  inputRouter.use('/', router);
};
