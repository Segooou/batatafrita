import { Router } from 'express';
import {
  deletePlatformController,
  findOnePlatformController,
  findPlatformController,
  insertPlatformController,
  updatePlatformController
} from '../../../application/controller/platform';
import { handleMulterError, insertImage, uploadOneFileMiddleware } from '../../utils/file-handler';

export const PlatformRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post(
    '/',
    uploadOneFileMiddleware,
    handleMulterError,
    insertImage(),
    insertPlatformController()
  );
  router.get('/', findPlatformController());
  router.get('/:id', findOnePlatformController());
  router.put(
    '/:id',
    uploadOneFileMiddleware,
    handleMulterError,
    insertImage(),
    updatePlatformController()
  );
  router.delete('/:id', deletePlatformController());

  inputRouter.use('/platform', router);
};
