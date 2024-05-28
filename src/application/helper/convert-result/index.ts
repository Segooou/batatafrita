export const convertResult = (result: string[]): string[] => {
  if (result.length > 0)
    return result.map((item) => {
      switch (item) {
        case 'LOGIN failed.':
          return 'Erro ao fazer login';

        default:
          return item;
      }
    });

  return [''];
};
