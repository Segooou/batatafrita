import { Router } from 'express';
import {
  deleteFunctionalityImageController,
  deleteImageOnFunctionalityImageController,
  findFunctionalityImageController,
  findOneFunctionalityImageController,
  insertFunctionalityImageController,
  insertImageOnFunctionalityController,
  updateActiveFunctionalityImageController,
  updateFunctionalityImageController
} from '../../../application/controller/functionality-image';
import { handleMulterError, insertImage, uploadOneFileMiddleware } from '../../utils/file-handler';

export const FunctionalityImageRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertFunctionalityImageController());
  router.post(
    '/file',
    uploadOneFileMiddleware,
    handleMulterError,
    insertImage(),
    insertImageOnFunctionalityController()
  );
  router.get('/', findFunctionalityImageController());
  router.get('/:id', findOneFunctionalityImageController());
  router.put('/:id', updateFunctionalityImageController());
  router.put('/active/:id', updateActiveFunctionalityImageController());
  router.delete('/:id', deleteFunctionalityImageController());
  router.delete('/image-on-functionality/:id', deleteImageOnFunctionalityImageController());

  inputRouter.use('/functionality-image', router);
};
