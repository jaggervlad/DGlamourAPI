const { Pedido } = require('../../database/Pedido');
const { Producto } = require('../../database/Producto');

module.exports = {
  Query: {
    mejoresClientes: async () => {
      try {
        return await Pedido.aggregate([
          { $match: { estado: 'PAGADO' } },
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
          { $match: { estado: 'PAGADO' } },
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

    totalDeVentas: async (_, __) => {
      try {
        const res = await Pedido.find({ estado: 'PAGADO' });
        const totalVentas = res.reduce(
          (nuevoTotal, pedido) => (nuevoTotal += pedido.total),
          0
        );

        console.log(res);
        const total = totalVentas;
        return { total };
      } catch (error) {
        throw new Error('💥ERROR💥');
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
