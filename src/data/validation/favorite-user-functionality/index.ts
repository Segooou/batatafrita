import { booleanRequired, numberRequired } from '../../../main/utils';
import { yup } from '../../../infra/yup';

export const updateFavoriteUserFunctionalitySchema = yup.object().shape({
  body: yup.object().shape({
    functionalityId: numberRequired({
      english: 'functionality id',
      portuguese: 'id da funcionalidade'
    }),
    isFavorite: booleanRequired({
      english: 'is favorite',
      portuguese: 'é favorito'
    })
  })
});
