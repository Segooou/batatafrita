import { Router } from 'express';
import {
  cnhImageController,
  rgImageController,
  uploadImageController
} from '../../../application/controller/image';
import { handleMulterError, insertImage, uploadFilesMiddleware } from '../../utils/file-handler';

export const ImageRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/cnh', cnhImageController());
  router.post('/rg', rgImageController());
  router.post(
    '/upload',
    uploadFilesMiddleware,
    handleMulterError,
    insertImage(),
    uploadImageController()
  );

  inputRouter.use('/image', router);
};
