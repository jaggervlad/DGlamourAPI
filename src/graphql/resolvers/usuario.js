const { Usuario } = require('../../database/Usuario');
const { iniciarSesion, cerrarSesion } = require('../../utils/auth');

module.exports = {
  Query: {
    obtenerUsuario: async (_, __, ctx) => {
      return ctx.usuario;
    },
  },

  Mutation: {
    nuevoUsuario: async (_, { id, input }) => {
      const { nombre, username, password, rol } = input;
      if (id) {
        try {
          const dbUsuario = await Usuario.findById(id);
          if (!dbUsuario) throw new Error('No existe el usuario');
          dbUsuario.nombre = nombre;
          dbUsuario.username = username;
          dbUsuario.password = password;
          dbUsuario.rol = rol;
          await dbUsuario.save();
          return dbUsuario;
        } catch (error) {
          throw new Error('No se pudo actualizar al usuario');
        }
      }
      // En caso de que sea nuevo
      const existeUsuario = await Usuario.findOne({ username });
      if (existeUsuario) {
        throw new Error('El usuario ya esta registrado');
      }
      try {
        const usuario = new Usuario(input);
        usuario.id = usuario._id;
        await usuario.save();
        return usuario;
      } catch (error) {
        console.log(error);
        throw new Error('No se pudo crear al usuario!. Intentalo de nuevo');
      }
    },
    autenticarUsuario: async (_, { input }, { req }) => {
      const { username, password } = input;
      const usuarioId = await iniciarSesion({ username, password });
      req.session.usuarioId = usuarioId;
      return 'Bienvenido  a la aplicacion!';
    },

    logout: async (_, __, { req }) => {
      return cerrarSesion(req);
    },
  },
};
