import mongoose from 'mongoose';
import { DB_URI, DB_OPTIONS } from '../config';

export const connectDB = async () => {
  const dbUri = DB_URI;
  try {
    await mongoose.connect(dbUri, DB_OPTIONS);

    console.log(`DB conectada: ${dbUri}`);
  } catch (error) {
    console.log('Hubo un error al conectar la BD');
    console.log(error);
    process.exit(1);
  }
};
