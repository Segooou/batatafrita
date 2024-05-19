import type { messageTypeResponse } from '../../../../errors';

export const yupMessages = {
  booleanSchema: (value: messageTypeResponse): messageTypeResponse => ({
    english: `The field ${value.english} must be a boolean`,
    portuguese: `O campo ${value.portuguese} deve ser boleano`
  }),

  dateSchema: {
    english: 'Invalid date',
    portuguese: 'Dados inválidos'
  },

  emailSchema: {
    english: 'Invalid email',
    portuguese: 'E-mail inválido'
  },

  maxLength: (field: messageTypeResponse, number: number): messageTypeResponse => ({
    english: `The field ${field.english} must be at most ${number} characters`,
    portuguese: `O campo ${field.portuguese} deve ter no máximo ${number} caracteres`
  }),

  numberSchema: (value: messageTypeResponse): messageTypeResponse => ({
    english: `The field ${value.english} must be a number`,
    portuguese: `O campo ${value.portuguese} deve ser um número`
  }),

  phoneSchema: {
    english: 'Invalid phone number',
    portuguese: 'Número de telefone inválido'
  },

  requiredSchema: (value: messageTypeResponse): messageTypeResponse => ({
    english: `The field ${value.english} is required`,
    portuguese: `O campo ${value.portuguese} é obrigatório`
  }),

  stringSchema: (value: messageTypeResponse): messageTypeResponse => ({
    english: `The field ${value.english} must be a text`,
    portuguese: `O campo ${value.portuguese} deve ser um texto`
  }),

  zipCodeSchema: {
    english: 'Invalid zipCode',
    portuguese: 'CEP inválido'
  }
};
