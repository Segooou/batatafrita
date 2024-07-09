import { Router } from 'express';
import { updateUserFunctionalitiesController } from '../../../application/controller/user';

export const UserFunctionalitiesRoutes = (inputRouter: Router): void => {
  const router = Router();

  router.put('/', updateUserFunctionalitiesController());

  inputRouter.use('/user-functionalities', router);
};
