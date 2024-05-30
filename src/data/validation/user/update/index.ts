import { stringNotRequired } from '../../../../main/utils';
import { yup } from '../../../../infra/yup';

export const updateUserSchema = yup.object().shape({
  body: yup.object().shape({
    avatar: stringNotRequired({
      english: 'avatar',
      portuguese: 'avatar'
    }),
    password: stringNotRequired({
      english: 'password',
      portuguese: 'senha'
    }),
    username: stringNotRequired({
      english: 'username',
      portuguese: 'nome de Usuario'
    })
  })
});
