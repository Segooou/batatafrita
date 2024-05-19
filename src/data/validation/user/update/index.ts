import { emailNotRequired, stringNotRequired } from '../../../../main/utils';
import { yup } from '../../../../infra/yup';

export const updateUserSchema = yup.object().shape({
  body: yup.object().shape({
    email: emailNotRequired(),
    password: stringNotRequired({
      english: 'password',
      portuguese: 'senha'
    })
  })
});
