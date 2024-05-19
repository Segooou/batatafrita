import { messages } from '../../../domain/helpers';
import { yup } from '../../../infra/yup';
import type {
  AnyObject,
  AnySchema,
  BooleanSchema,
  DateSchema,
  Maybe,
  MixedSchema,
  NumberSchema,
  StringSchema
} from 'yup';
import type { messageTypeResponse } from '../../../domain/errors';

export const emailRequired = (): StringSchema =>
  yup
    .string()
    .email(JSON.stringify(messages.yup.emailSchema))
    .required(
      JSON.stringify(messages.yup.requiredSchema({ english: 'email', portuguese: 'e-mail' }))
    );

export const emailNotRequired = (): StringSchema =>
  yup.string().email(JSON.stringify(messages.yup.emailSchema));

export const stringRequired = (field: messageTypeResponse & { length?: number }): StringSchema =>
  typeof field.length === 'number'
    ? yup
        .string()
        .strict(true)
        .typeError(JSON.stringify(messages.yup.stringSchema(field)))
        .max(field.length, JSON.stringify(messages.yup.maxLength(field, field.length)))
        .required(JSON.stringify(messages.yup.requiredSchema(field)))
    : yup
        .string()
        .strict(true)
        .typeError(JSON.stringify(messages.yup.stringSchema(field)))
        .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const stringNotRequired = (
  field: messageTypeResponse & { length?: number }
): StringSchema<Maybe<string | undefined>> =>
  typeof field.length === 'number'
    ? yup
        .string()
        .strict(true)
        .typeError(JSON.stringify(messages.yup.stringSchema(field)))
        .max(field.length, JSON.stringify(messages.yup.maxLength(field, field.length)))
        .notRequired()
    : yup
        .string()
        .strict(true)
        .typeError(JSON.stringify(messages.yup.stringSchema(field)))
        .notRequired();

export const mixedRequired = (field: messageTypeResponse): MixedSchema =>
  yup.mixed().required(JSON.stringify(messages.yup.requiredSchema(field)));

export const mixedNotRequired = (): MixedSchema<Maybe<AnyObject>> => yup.mixed().notRequired();

export const phoneRequired = (): StringSchema =>
  yup
    .string()
    .transform((value) => String(value)?.replace(/\D/gu, ''))
    .matches(/^\d{11}$/u, JSON.stringify(messages.yup.phoneSchema))
    .required(
      JSON.stringify(messages.yup.requiredSchema({ english: 'phone', portuguese: 'telefone' }))
    );

export const phoneNotRequired = (): StringSchema<Maybe<string | undefined>> =>
  yup
    .string()
    .transform((value) => String(value)?.replace(/\D/gu, ''))
    .matches(/^\d{11}$/u, JSON.stringify(messages.yup.phoneSchema))
    .notRequired();

export const zipCodeRequired = (): StringSchema =>
  yup
    .string()
    .transform((value) => String(value)?.replace(/\D/gu, ''))
    .matches(/^\d{8}$/u, JSON.stringify(messages.yup.zipCodeSchema))
    .required(
      JSON.stringify(messages.yup.requiredSchema({ english: 'zip code', portuguese: 'CEP' }))
    );

export const zipCodeNotRequired = (): StringSchema<Maybe<string | undefined>> =>
  yup
    .string()
    .transform((value) => String(value)?.replace(/\D/gu, ''))
    .matches(/^\d{9}$/u, JSON.stringify(messages.yup.zipCodeSchema))
    .notRequired();

export const booleanRequired = (field: messageTypeResponse): BooleanSchema =>
  yup
    .boolean()
    .strict(true)
    .typeError(JSON.stringify(messages.yup.booleanSchema(field)))
    .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const booleanNotRequired = (
  field: messageTypeResponse
): BooleanSchema<Maybe<boolean | undefined>> =>
  yup
    .boolean()
    .strict(true)
    .typeError(JSON.stringify(messages.yup.booleanSchema(field)))
    .notRequired();

export const numberRequired = (field: messageTypeResponse): NumberSchema =>
  yup
    .number()
    .typeError(JSON.stringify(messages.yup.numberSchema(field)))
    .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const numberNotRequired = (
  field: messageTypeResponse
): NumberSchema<Maybe<number | undefined>> =>
  yup
    .number()
    .typeError(JSON.stringify(messages.yup.numberSchema(field)))
    .notRequired();

export const dateRequired = (field: messageTypeResponse): DateSchema =>
  yup
    .date()
    .typeError(JSON.stringify(messages.yup.dateSchema))
    .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const dateNotRequired = (): DateSchema<Maybe<Date | undefined>> =>
  yup.date().typeError(JSON.stringify(messages.yup.dateSchema)).notRequired();

export const arrayRequired = (data: AnySchema, field: messageTypeResponse): AnySchema =>
  yup
    .array()
    .of(data)
    .min(1)
    .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const arrayNotRequired = (data: AnySchema): AnySchema => yup.array().of(data).notRequired();

export const enumTypeRequired = <Enum extends object>(
  field: messageTypeResponse & { data: Enum }
): AnySchema =>
  yup
    .mixed<Enum>()
    .oneOf(
      Object.values(field.data),
      JSON.stringify({
        english: 'inform an valid option',
        portuguese: 'informe uma opção válida'
      })
    )
    .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const enumTypeNotRequired = <Enum extends object>(
  field: messageTypeResponse & { data: Enum }
): AnySchema =>
  yup
    .mixed<Enum>()
    .oneOf(
      Object.values(field.data),
      JSON.stringify({
        english: 'inform an valid option',
        portuguese: 'informe uma opção válida'
      })
    )
    .notRequired();
