const { Usuario } = require('../database/Usuario');
const { AuthenticationError } = require('apollo-server-express');
const { SESS_NAME } = require('../config');

const enLinea = (req) => req.session.usuarioId;

module.exports.iniciarSesion = async ({ username, password }) => {
  const usuario = await Usuario.findOne({ username });
  if (!usuario) {
    throw new AuthenticationError(
      'Credenciales Incorrectas, Intetalo de nuevo.'
    );
  }
  await usuario.comparePassword(password);
  const usuarioId = usuario._id;
  return usuarioId;
};

module.exports.cerrarSesion = (req) => {
  req.session = null;
  return true;
};

module.exports.asegurarInicio = (req) => {
  if (!enLinea(req)) {
    throw new AuthenticationError('Debes iniciar sesion');
  }
  return true;
};

module.exports.asegurarCierre = (req) => {
  if (enLinea(req)) {
    throw new AuthenticationError('Aun estas logueado');
  }
  return true;
};

module.exports.authContext = async (req) => {
  const id = req.session.usuarioId;
  try {
    return await Usuario.findById(id);
  } catch (error) {
    throw new Error('Error! No se pudo autenticar');
  }
};
