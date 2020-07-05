import { sign, verify } from 'jsonwebtoken';
import lodash from 'lodash';

export const signJwt = (user, expiresIn) => {
  if (!user) return '';
  const payload = lodash.pick(user, ['id', 'nombre', 'username', 'apellido']);
  return sign({ payload }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

export const authContext = (req) => {
  const token = req.session.token;
  if (token) {
    try {
      const usuario = verify(token, process.env.JWT_SECRET);
      return usuario;
    } catch (error) {
      console.log(error);
      throw new Error('No estas autenticado');
    }
  }
};
