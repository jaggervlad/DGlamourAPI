import { Pedido } from '../../database/Pedido';
import { Usuario } from '../../database/Usuario';
import { Producto } from '../../database/Producto';
import { Cliente } from '../../database/Cliente';
import { sellContext } from '../../utils/sellContext';

export default {
  Pedido: {
    vendedor: async (parent, _args, _context) => {
      return await Usuario.findById(parent.vendedor);
    },
    cliente: async (parent, _args, _context) => {
      return await Cliente.findById(parent.cliente);
    },
  },
  Query: {
    obtenerPedidos: async () => {
      try {
        return await Pedido.find({});
      } catch (error) {
        console.log(error);
        throw new Error('No se pudo obtener los pedidos!');
      }
    },
    obtenerPedidosVendedor: async (_, {}, ctx) => {
      if (!ctx.usuario) return null;
      try {
        return await Pedido.find({ vendedor: ctx.usuario.id }).sort({
          _id: -1,
        });
      } catch (error) {
        console.log(error);
        throw new Error('No se pudo obtener a los pedidos por vendedor');
      }
    },
    obtenerPedido: async (_, { id }, ctx) => {
      // Si el pedido existe o no
      const pedido = await Pedido.findById(id);
      if (!pedido) {
        throw new Error('Pedido no encontrado');
      }

      // Solo quien lo creo puede verlo
      sellContext(pedido, ctx);
      return pedido;
    },
    obtenerPedidosEstado: async (_, { estado }, ctx) => {
      try {
        return await Pedido.find({ vendedor: ctx.usuario.payload.id, estado });
      } catch (error) {
        console.log(error);
        throw new Error('No se pudo obtener el estado del pedido');
      }
    },
  },
  Mutation: {
    nuevoPedido: async (_, { input }, ctx) => {
      const { cliente } = input;
      let clienteExiste = await Cliente.findById(cliente);
      if (!clienteExiste) throw new Error('Ese cliente no existe');
      sellContext(clienteExiste, ctx);

      // Revisar que el stock este disponible
      for await (const articulo of input.pedido) {
        const { id } = articulo;
        const producto = await Producto.findById(id);
        if (articulo.cantidad > producto.existencia) {
          throw new Error(
            `El articulo: ${producto.nombre} excede la cantidad disponible`
          );
        }
        // Restar la cantidad a lo disponible
        producto.existencia = producto.existencia - articulo.cantidad;
        await producto.save();
      }

      const nuevoPedido = new Pedido(input);
      nuevoPedido.id = nuevoPedido._id;
      nuevoPedido.vendedor = ctx.usuario.id;
      await nuevoPedido.save();
      return nuevoPedido;
    },
    actualizarPedido: async (_, { id, input }, ctx) => {
      const { cliente } = input;
      // Si el pedido existe
      const existePedido = await Pedido.findById(id);
      if (!existePedido) {
        throw new Error('El pedido no existe');
      }

      // Si el cliente existe
      const existeCliente = await Cliente.findById(cliente);
      if (!existeCliente) {
        throw new Error('El Cliente no existe');
      }

      // Si el cliente y pedido pertenece al vendedor
      sellContext(existeCliente, ctx);

      // Revisar el stock
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
      // Guardar el pedido
      return await Pedido.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
    },
    eliminarPedido: async (_, { id }, ctx) => {
      // Verificar si el pedido existe o no
      const pedido = await Pedido.findById(id);
      if (!pedido) throw new Error('El pedido no existe');

      // verificar si el vendedor es quien lo borra
      if (pedido.vendedor.toString() !== ctx.usuario.id)
        throw new Error('No tienes las credenciales');

      // eliminar de la base de datos
      await Pedido.findOneAndDelete({ _id: id });
      return 'Pedido Eliminado';
    },
  },
};
