import mongoose from 'mongoose';
import { DB_OPTIONS } from '../config';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);

    console.log(`DB conectada: ${process.env.DB_URI}`);
  } catch (error) {
    console.log('Hubo un error al conectar la BD');
    console.log(error);
    process.exit(1);
  }
};
