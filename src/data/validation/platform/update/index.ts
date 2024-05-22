import { mixedNotRequired, stringNotRequired } from '../../../../main/utils';
import { yup } from '../../../../infra/yup';

export const updatePlatformSchema = yup.object().shape({
  body: yup.object().shape({
    description: stringNotRequired({
      english: 'description',
      portuguese: 'descrição'
    }),
    image: mixedNotRequired(),
    name: stringNotRequired({
      english: 'name',
      portuguese: 'nome'
    })
  })
});
