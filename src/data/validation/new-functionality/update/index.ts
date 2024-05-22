import { booleanNotRequired, stringNotRequired } from '../../../../main/utils';
import { yup } from '../../../../infra/yup';

export const updateNewFunctionalitySchema = yup.object().shape({
  body: yup.object().shape({
    description: stringNotRequired({
      english: 'description',
      portuguese: 'descrição'
    }),
    name: stringNotRequired({
      english: 'name',
      portuguese: 'nome'
    }),
    platformId: stringNotRequired({
      english: 'platform id',
      portuguese: 'id da plataforma'
    }),
    wasRaised: booleanNotRequired({
      english: 'was raised',
      portuguese: 'foi criado'
    })
  })
});
