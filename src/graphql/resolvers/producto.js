const { Producto } = require('../../database/Producto');
const { Categoria } = require('../../database/Categoria');

module.exports = {
  Producto: {
    categoria: async (parent, _args, { loader }) => {
      return loader.single.load(Categoria, parent.categoria);
    },
  },
  Query: {
    obtenerProductos: async (_, __, ___) => {
      try {
        const productos = await Producto.find({});
        return productos;
      } catch (error) {
        console.log(error);
        throw new Error('No se pudieron obtener los productos');
      }
    },
    obtenerProducto: async (_, { id }) => {
      // revisar si el producto existe o no
      const producto = await Producto.findById(id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
      return producto;
    },
  },
  Mutation: {
    nuevoProducto: async (_, { input }) => {
      const existProduct = await Producto.findOne({ codigo: input.codigo });
      if (existProduct)
        throw new Error(`El producto  ya existe en la base de datos`);
      try {
        const producto = new Producto(input);
        producto.id = producto._id;
        await producto.save();
        return producto;
      } catch (error) {
        console.log(error);
        throw new Error('No se pudo crear el producto');
      }
    },
    actualizarProducto: async (_, { id, input }) => {
      try {
        return await Producto.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
      } catch (error) {
        throw new Error('No se pudo actualizar el producto');
      }
    },
    eliminarProducto: async (_, { id }) => {
      try {
        await Producto.findOneAndDelete({ _id: id });
        return 'Producto Eliminado';
      } catch (error) {
        throw new Error('No se pudo eliminar el producto');
      }
    },
  },
};
