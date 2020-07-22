const { Categoria } = require('../../database/Categoria');

module.exports = {
  Query: {
    obtenerCategorias: async (_, __, ___) => {
      try {
        return await Categoria.find();
      } catch (error) {
        throw new Error('No hay categorias!');
      }
    },
    obtenerCategoria: async (_, { id }, __) => {
      const categoriaExistente = await Categoria.findById(id);
      if (!categoriaExistente) throw new Error('No existe esa categoria');

      return categoriaExistente;
    },
  },
  Mutation: {
    nuevaCategoria: async (_, { input }, __) => {
      const categoriaExistente = await Categoria.findOne({
        nombre: input.nombre,
      });
      if (categoriaExistente) throw new Error('Categoria ya existe');
      try {
        const categoria = new Categoria(input);
        categoria.id = categoria._id;
        await categoria.save();
        return categoria;
      } catch (error) {
        throw new Error('Error! No se pudo crear');
      }
    },
    actualizarCategoria: async (_, { id, input }, __) => {
      try {
        return await Categoria.findByIdAndUpdate(id, input, { new: true });
      } catch (error) {
        throw new Error('No se pudo actulizar categoria');
      }
    },
    eliminarCategoria: async (_, { id }, __) => {
      console.log(id);
      try {
        await Categoria.findByIdAndDelete(id);
        return 'Categoria eliminada';
      } catch (error) {
        throw new Error('Error! No se pudo eliminar categoria');
      }
    },
  },
};
