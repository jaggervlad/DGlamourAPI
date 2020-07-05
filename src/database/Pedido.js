import { Schema, model } from 'mongoose';

const ProductoSchema = new Schema(
  {
    pedido: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    cliente: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Cliente',
    },
    vendedor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Usuario',
    },
    estado: {
      type: String,
      default: 'PENDIENTE',
    },
    creado: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

export const Pedido = model('Pedido', ProductoSchema);
