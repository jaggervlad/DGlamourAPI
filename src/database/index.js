const mongoose = require('mongoose');
const { DB_OPTIONS, CONFIG } = require('../config');

module.exports.connectDB = async () => {
  try {
    await mongoose.connect(CONFIG.dbUri, DB_OPTIONS);

    console.log(`DB conectada: ${CONFIG.dbUri}`);
  } catch (error) {
    console.log('Hubo un error al conectar la BD');
    console.log(error);
    process.exit(1);
  }
};
