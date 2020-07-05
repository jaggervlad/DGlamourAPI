import bcrypt from 'bcrypt';

export const hashPassword = async (pwd) => {
  if (!pwd) return '';
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pwd, salt);
};

export const validatePassword = async (inputPsw, bdPsw) => {
  const validPassword = await bcrypt.compare(inputPsw, bdPsw);
  if (!validPassword) throw new Error('Credenciales incorrectas');
  return validPassword;
};
