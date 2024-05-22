import { Router } from 'express';
import {
  deleteUserController,
  findOneUserController,
  findUserController,
  updateUserController
} from '../../../application/controller/user';
import { handleMulterError, insertImage, uploadOneFileMiddleware } from '../../utils/file-handler';

export const UserRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findUserController());
  router.get('/:id', findOneUserController());
  router.put(
    '/:id',
    uploadOneFileMiddleware,
    handleMulterError,
    insertImage(),
    updateUserController()
  );
  router.delete('/:id', deleteUserController());

  inputRouter.use('/user', router);
};
