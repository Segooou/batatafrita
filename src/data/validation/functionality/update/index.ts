import { booleanNotRequired, numberNotRequired, stringNotRequired } from '../../../../main/utils';
import { yup } from '../../../../infra/yup';

export const updateFunctionalitySchema = yup.object().shape({
  body: yup.object().shape({
    description: stringNotRequired({
      english: 'description',
      portuguese: 'descrição'
    }),
    googleSheets: numberNotRequired({
      english: 'google sheets',
      portuguese: 'google sheets'
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
