import { Producto } from '../../database/Producto';

export default {
  Query: {
    obtenerProductos: async (_, __, { req }) => {
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
      const existProduct = await Producto.findOne({ nombre: input.nombre });
      if (existProduct)
        throw new Error(
          `El producto nombre: ${input.nombre}, ya existe en la base de datos`
        );
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
      // revisar si el producto existe o no
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
