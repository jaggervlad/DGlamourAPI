import { Cliente } from '../../database/Cliente';
import { Usuario } from '../../database/Usuario';
import { sellContext } from '../../utils/sellContext';

export default {
  Cliente: {
    vendedor: async (parent, _args, _context) => {
      return await Usuario.findById(parent.vendedor);
    },
  },
  Query: {
    obtenerClientes: async () => {
      try {
        return await Cliente.find({});
      } catch (error) {
        console.log(error);
        throw new Error('No se pudo obtener a los clientes');
      }
    },
    obtenerClientesVendedor: async (_, {}, ctx) => {
      if (!ctx.usuario) return null;
      try {
        return await Cliente.find({
          vendedor: ctx.usuario.id.toString(),
        });
      } catch (error) {
        console.log(error);
        throw new Error('No se pudo obtener a lo clientes por vendedor');
      }
    },
    obtenerCliente: async (_, { id }, ctx) => {
      // Revisar si el cliente existe o no
      const cliente = await Cliente.findById(id);

      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }

      // Quien lo creo puede verlo
      sellContext(cliente, ctx);
      return cliente;
    },
  },

  Mutation: {
    nuevoCliente: async (_, { input }, ctx) => {
      const { email } = input;
      // Verificar si el cliente ya esta registrado
      const cliente = await Cliente.findOne({ email });
      if (cliente) {
        throw new Error('Ese cliente ya esta registrado');
      }
      const nuevoCliente = new Cliente(input);
      nuevoCliente.id = nuevoCliente._id;
      // asignar el vendedor
      nuevoCliente.vendedor = ctx.usuario.id;

      // guardarlo en la base de datos
      try {
        await nuevoCliente.save();
        return nuevoCliente;
      } catch (error) {
        console.log(error);
        throw new Error('No se pudo registrar al cliente');
      }
    },
    actualizarCliente: async (_, { id, input }, ctx) => {
      // Verificar si existe o no
      let cliente = await Cliente.findById(id);

      if (!cliente) {
        throw new Error('Ese cliente no existe');
      }

      // Verificar si el vendedor es quien edita
      sellContext(cliente, ctx);
      try {
        // guardar el cliente
        return await Cliente.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
      } catch (error) {
        console.log(error);
        throw new Error('No se pudo actualizar al cliente');
      }
    },
    eliminarCliente: async (_, { id }, ctx) => {
      // Verificar si existe o no
      let cliente = await Cliente.findById(id);

      if (!cliente) {
        throw new Error('Ese cliente no existe');
      }

      // Verificar si el vendedor es quien edita
      sellContext(cliente, ctx);
      // Eliminar Cliente
      try {
        await Cliente.findOneAndDelete({ _id: id });
        return 'Cliente Eliminado';
      } catch (error) {
        throw new Error('No se pudo eliminar al cliente');
      }
    },
  },
};
