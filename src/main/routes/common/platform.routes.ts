import { Router } from 'express';
import {
  findOnePlatformByKeywordController,
  findOnePlatformController,
  findPlatformController
} from '../../../application/controller/platform';

export const PlatformRoutesCommon = (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findPlatformController());
  router.get('/:id', findOnePlatformController());
  router.get('/keyword/:id', findOnePlatformByKeywordController());

  inputRouter.use('/platform', router);
};
