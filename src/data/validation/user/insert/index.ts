import { stringRequired } from '../../../../main/utils';
import { yup } from '../../../../infra/yup';

export const insertUserSchema = yup.object().shape({
  body: yup.object().shape({
    email: stringRequired({
      english: 'username',
      portuguese: 'Nome de Usuario'
    }),
    password: stringRequired({
      english: 'password',
      portuguese: 'senha'
    })
  })
});
