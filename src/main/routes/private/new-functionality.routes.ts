import { Router } from 'express';
import {
  deleteNewFunctionalityController,
  findNewFunctionalityController,
  findOneNewFunctionalityController,
  insertNewFunctionalityController,
  updateNewFunctionalityController
} from '../../../application/controller/new-functionality';

export const NewFunctionalityRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertNewFunctionalityController());
  router.get('/', findNewFunctionalityController());
  router.get('/:id', findOneNewFunctionalityController());
  router.put('/:id', updateNewFunctionalityController());
  router.delete('/:id', deleteNewFunctionalityController());

  inputRouter.use('/new-functionality', router);
};
