const mongoose = require('mongoose');
const { DB_OPTIONS } = require('../config');

module.exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, DB_OPTIONS);

    console.log(`DB conectada: ${process.env.DB_URI}`);
  } catch (error) {
    console.log('Hubo un error al conectar la BD');
    console.log(error);
    process.exit(1);
  }
};
