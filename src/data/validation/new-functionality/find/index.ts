export type newFunctionalityQueryFields =
  | 'description'
  | 'name'
  | 'platformId'
  | 'userId'
  | 'wasRaisedBoolean';

export const newFunctionalityListQueryFields: newFunctionalityQueryFields[] = [
  'name',
  'description',
  'userId',
  'platformId',
  'wasRaisedBoolean'
];
