import { InputType } from '@prisma/client';
import {
  arrayRequired,
  booleanRequired,
  enumTypeRequired,
  numberNotRequired,
  numberRequired,
  stringNotRequired,
  stringRequired
} from '../../../../main/utils';
import { yup } from '../../../../infra/yup';

export const inputPropsSchema = yup.object().shape({
  isRequired: booleanRequired({
    english: 'is required',
    portuguese: 'isRequired'
  }),
  label: stringRequired({
    english: 'label',
    portuguese: 'legenda'
  }),
  mask: stringNotRequired({
    english: 'mask',
    portuguese: 'máscara'
  }),
  maskLength: numberNotRequired({
    english: 'mask length',
    portuguese: 'tamanho da máscara'
  }),
  placeholder: stringRequired({
    english: 'placeholder',
    portuguese: 'placeholder'
  }),
  type: enumTypeRequired({
    data: InputType,
    english: 'mask length',
    portuguese: 'tamanho da máscara'
  })
});

export const insertFunctionalitySchema = yup.object().shape({
  body: yup.object().shape({
    apiRoute: stringRequired({
      english: 'api route',
      portuguese: 'rota da api'
    }),
    description: stringNotRequired({
      english: 'description',
      portuguese: 'descrição'
    }),
    inputProps: arrayRequired(inputPropsSchema, {
      english: 'input props',
      portuguese: 'propriedades dos inputs'
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
