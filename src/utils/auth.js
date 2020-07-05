import { Usuario } from '../database/Usuario';
import { AuthenticationError } from 'apollo-server-express';
import { config } from '../config';
import { signJwt } from './token';

const enLinea = (req) => req.session.token;

export const iniciarSesion = async ({ username, password }) => {
  const usuario = await Usuario.findOne({ username });
  if (!usuario) {
    throw new AuthenticationError(
      'Credenciales Incorrectas, Intetalo de nuevo.'
    );
  }
  await usuario.comparePassword(password);
  const token = signJwt(usuario, '1h');
  if (!token)
    throw new AuthenticationError(
      'No se pudo iniciar sesion, porfavor intenta de nuevo!'
    );
  return token;
};

export const cerrarSesion = (req, res) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) reject(error);

      res.clearCookie(config.sessName);
      resolve(true);
    });
  });
};

export const asegurarInicio = (req) => {
  if (!enLinea(req)) {
    throw new AuthenticationError('Debes estar logueado');
  }
  return true;
};

export const asegurarCierre = (req) => {
  if (enLinea(req)) {
    throw new AuthenticationError('Aun estas logueado');
  }
  return true;
};
