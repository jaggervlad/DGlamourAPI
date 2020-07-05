import { Pedido } from '../../database/Pedido';

export default {
  Query: {
    mejoresClientes: async () => {
      try {
        return await Pedido.aggregate([
          { $match: { estado: 'COMPLETADO' } },
          {
            $group: {
              _id: '$cliente',
              total: { $sum: '$total' },
            },
          },
          {
            $lookup: {
              from: 'clientes',
              localField: '_id',
              foreignField: '_id',
              as: 'cliente',
            },
          },
          { $limit: 10 },
          { $sort: { total: -1 } },
        ]);
      } catch (error) {
        throw new Error('No se pudo obtener a los mejores clientes!');
      }
    },
    mejoresVendedores: async () => {
      try {
        return await Pedido.aggregate([
          { $match: { estado: 'COMPLETADO' } },
          {
            $group: {
              _id: '$vendedor',
              total: { $sum: '$total' },
            },
          },
          {
            $lookup: {
              from: 'usuarios',
              localField: '_id',
              foreignField: '_id',
              as: 'vendedor',
            },
          },
          { $limit: 3 },
          { $sort: { total: -1 } },
        ]);
      } catch (error) {
        throw new Error('No se pudo obtener a los mejores vendedores!');
      }
    },
    buscarProducto: async (_, { texto }) => {
      try {
        return await Producto.find({
          $text: { $search: texto },
        }).limit(10);
      } catch (error) {
        throw new Error(`Error | ${error.message}`);
      }
    },
  },
};
