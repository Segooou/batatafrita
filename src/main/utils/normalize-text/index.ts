export const normalizeText = (text: string): string => {
  const withoutAccents = text.normalize('NFD').replace(/[\u0300-\u036f]/gu, '');

  const withHyphens = withoutAccents.replace(/\s+/gu, '-');

  return withHyphens.toLowerCase();
};
