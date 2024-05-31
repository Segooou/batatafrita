import { Router } from 'express';
import {
  deleteFunctionalityController,
  executeFunctionalityController,
  findFunctionalityController,
  findOneFunctionalityByKeywordController,
  findOneFunctionalityController,
  insertFunctionalityController,
  updateFunctionalityController
} from '../../../application/controller/functionality';

export const FunctionalityRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertFunctionalityController());
  router.post('/execute', executeFunctionalityController());
  router.get('/', findFunctionalityController());
  router.get('/:id', findOneFunctionalityController());
  router.get('/keyword/:id', findOneFunctionalityByKeywordController());
  router.put('/:id', updateFunctionalityController());
  router.delete('/:id', deleteFunctionalityController());

  inputRouter.use('/functionality', router);
};
