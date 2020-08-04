const { Pedido } = require('../../database/Pedido');
const { Usuario } = require('../../database/Usuario');
const { Producto } = require('../../database/Producto');
const { Cliente } = require('../../database/Cliente');
const _ = require('lodash');

module.exports = {
  Pedido: {
    vendedor: async (parent, _args, _context) => {
      return await Usuario.findById(parent.vendedor);
    },
    cliente: async (parent, _args, _context) => {
      return await Cliente.findById(parent.cliente);
    },
  },
  Query: {
    obtenerPedidos: async (_, { offset, limit }, __) => {
      try {
        return await Pedido.find({})
          .limit(limit)
          .skip(offset)
          .sort({ _id: -1 });
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
    obtenerPedidosVendedor: async (_, {}, ctx) => {
      try {
        return await Pedido.find({ vendedor: ctx.usuario.id }).sort({
          _id: -1,
        });
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
    obtenerPedido: async (_, { id }, ctx) => {
      // Si el pedido existe o no
      try {
        return await Pedido.findById(id);
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
    obtenerPedidosEstado: async (_, { estado }, ctx) => {
      try {
        return await Pedido.find({ vendedor: ctx.usuario.payload.id, estado });
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },

    totalPedidos: async (_, __, ___) => {
      try {
        return await Pedido.countDocuments();
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
  },
  Mutation: {
    nuevoPedido: async (_, { input }, ctx) => {
      const { cliente } = input;
      let clienteExiste = await Cliente.findById(cliente);
      if (!clienteExiste) throw new Error('Ese cliente no existe');

      for await (const articulo of input.pedido) {
        const { id } = articulo;
        const producto = await Producto.findById(id);
        if (articulo.cantidad > producto.existencia) {
          throw new Error(
            `El articulo: ${producto.nombre} excede la cantidad disponible`
          );
        }
        await producto.save();
      }

      const nuevoPedido = new Pedido(input);
      nuevoPedido.id = nuevoPedido._id;
      nuevoPedido.vendedor = ctx.usuario.id;
      await nuevoPedido.save();
      return nuevoPedido;
    },
    actualizarPedido: async (_, { id, input }) => {
      const existePedido = await Pedido.findById(id);
      if (!existePedido) {
        throw new Error('❌Error! ❌');
      }

      if (input.estado === 'PAGADO') {
        if (input.pedido) {
          for await (const articulo of input.pedido) {
            const { id } = articulo;
            const producto = await Producto.findById(id);

            if (articulo.cantidad > producto.existencia) {
              throw new Error(
                `El articulo: ${producto.nombre} excede la cantidad disponible`
              );
            }
            producto.existencia = producto.existencia - articulo.cantidad;
            await producto.save();
          }
        }
      }

      try {
        return await Pedido.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
    eliminarPedido: async (_, { id }) => {
      try {
        await Pedido.findOneAndDelete({ _id: id });
        return 'Pedido Eliminado';
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
  },
};
