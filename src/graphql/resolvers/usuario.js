import { Usuario } from '../../database/Usuario';
import { iniciarSesion, cerrarSesion } from '../../utils/auth';

export default {
  Query: {
    obtenerUsuario: async (_, __, ctx) => {
      if (!ctx.usuario) return null;
      return ctx.usuario;
    },
  },

  Mutation: {
    nuevoUsuario: async (_, { id, input }) => {
      const { nombre, apellido, username, password } = input;
      if (id) {
        try {
          const dbUsuario = await Usuario.findById(id);
          if (!dbUsuario) throw new Error('No existe el usuario');
          dbUsuario.nombre = nombre;
          dbUsuario.apellido = apellido;
          dbUsuario.username = username;
          dbUsuario.password = password;
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
      const token = await iniciarSesion({ username, password });
      req.session.token = token;
      return 'Bienvenido  a la aplicacion!';
    },

    logout: async (_, __, { req, res }) => {
      return cerrarSesion(req, res);
    },
  },
};
