import { Schema, model } from 'mongoose';

const ClientesSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    empresa: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    creado: {
      type: Date,
      default: Date.now(),
    },
    vendedor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Usuario',
    },
  },
  { timestamps: true }
);

export const Cliente = model('Cliente', ClientesSchema);
