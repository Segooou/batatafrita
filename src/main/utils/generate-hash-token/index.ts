export const generateHashToken = (length = 32): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-!@#$_';
  let token = '';

  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * charset.length);

    token += charset[randomIndex];
  }

  return token;
};
