import { numberRequired, stringRequired } from '../../../../main/utils';
import { yup } from '../../../../infra/yup';

export const insertNewFunctionalitySchema = yup.object().shape({
  body: yup.object().shape({
    description: stringRequired({
      english: 'description',
      portuguese: 'descrição'
    }),
    name: stringRequired({
      english: 'name',
      portuguese: 'nome'
    }),
    platformId: numberRequired({
      english: 'platform id',
      portuguese: 'id da plataforma'
    })
  })
});
