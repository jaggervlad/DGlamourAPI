export const sellContext = (model, ctx) => {
  if (model.vendedor.toString() !== ctx.usuario.id) {
    throw new Error('No tienes las credenciales');
  }
};
