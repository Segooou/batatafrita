import { Router } from 'express';
import {
  deletePlatformController,
  findOnePlatformByKeywordController,
  findOnePlatformController,
  findPlatformController,
  insertPlatformController,
  updatePlatformController
} from '../../../application/controller/platform';

export const PlatformRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertPlatformController());
  router.get('/', findPlatformController());
  router.get('/:id', findOnePlatformController());
  router.get('/keyword/:id', findOnePlatformByKeywordController());
  router.put('/:id', updatePlatformController());
  router.delete('/:id', deletePlatformController());

  inputRouter.use('/platform', router);
};
