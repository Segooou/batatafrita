import { Router } from 'express';
import {
  cnh2ImageController,
  cnhImageController,
  uploadImageController
} from '../../../application/controller/image';
import { handleMulterError, insertImage, uploadFilesMiddleware } from '../../utils/file-handler';

export const ImageRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/cnh', cnhImageController());
  router.post('/cnh2', cnh2ImageController());
  router.post(
    '/upload',
    uploadFilesMiddleware,
    handleMulterError,
    insertImage(),
    uploadImageController()
  );

  inputRouter.use('/image', router);
};
