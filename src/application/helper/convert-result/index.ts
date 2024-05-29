export const convertResult = (result: string): string => {
  switch (result) {
    case 'LOGIN failed.':
      return 'Erro ao fazer login';
    case 'Timed out while authenticating with server':
      return 'Erro ao fazer login';

    default:
      return result ?? 'Error';
  }
};
