import { Router } from 'express';
import {
  executeFunctionalityController,
  findFunctionalityController,
  findFunctionalityResumeController,
  findOneFunctionalityByKeywordController,
  findOneFunctionalityController
} from '../../../application/controller/functionality';

export const FunctionalityRoutesCommon = (inputRouter: Router): void => {
  const router = Router();

  router.post('/execute', executeFunctionalityController());
  router.get('/', findFunctionalityController());
  router.get('/resume', findFunctionalityResumeController());
  router.get('/:id', findOneFunctionalityController());
  router.get('/keyword/:id', findOneFunctionalityByKeywordController());

  inputRouter.use('/functionality', router);
};
