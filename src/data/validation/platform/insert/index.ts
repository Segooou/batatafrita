import { mixedRequired, stringNotRequired, stringRequired } from '../../../../main/utils';
import { yup } from '../../../../infra/yup';

export const insertPlatformSchema = yup.object().shape({
  body: yup.object().shape({
    description: stringNotRequired({
      english: 'description',
      portuguese: 'descrição'
    }),
    image: mixedRequired({
      english: 'image',
      portuguese: 'imagem'
    }),
    name: stringRequired({
      english: 'name',
      portuguese: 'nome'
    })
  })
});
