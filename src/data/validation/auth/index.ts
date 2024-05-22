import { stringRequired } from '../../../main/utils';
import { yup } from '../../../infra/yup';

export const authenticateSchema = yup.object().shape({
  body: yup.object().shape({
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
