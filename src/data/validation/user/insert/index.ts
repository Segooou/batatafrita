import { stringNotRequired, stringRequired } from '../../../../main/utils';
import { yup } from '../../../../infra/yup';

export const insertUserSchema = yup.object().shape({
  body: yup.object().shape({
    avatar: stringNotRequired({
      english: 'avatar',
      portuguese: 'avatar'
    }),
    password: stringRequired({
      english: 'password',
      portuguese: 'senha'
    }),
    username: stringRequired({
      english: 'username',
      portuguese: 'nome de Usuario'
    })
  })
});
