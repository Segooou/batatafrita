import { Router } from 'express';
import {
  findFavoriteUserFunctionalityController,
  updateFavoriteUserFunctionalityController
} from '../../../application/controller/favorite-user-functionality';

export const FavoriteUserFunctionalityRoutesCommon = (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findFavoriteUserFunctionalityController());
  router.put('/', updateFavoriteUserFunctionalityController());

  inputRouter.use('/favorite-user-functionality', router);
};
