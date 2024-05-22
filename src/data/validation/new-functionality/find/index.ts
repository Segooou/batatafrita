export type newFunctionalityQueryFields =
  | 'description'
  | 'name'
  | 'platformId'
  | 'userId'
  | 'wasRaised'
  | 'wasRaisedBoolean';

export const newFunctionalityListQueryFields: newFunctionalityQueryFields[] = [
  'name',
  'description',
  'userId',
  'platformId',
  'wasRaised',
  'wasRaisedBoolean'
];
