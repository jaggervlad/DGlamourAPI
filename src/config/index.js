const {
  // ENVIROMENT
  NODE_ENV = 'dev',
  PORT = 4000,

  // JWT
  JWT_SECRET = 'secret',

  //DB
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
} = process.env;

const IN_PROD = NODE_ENV === 'production';

module.exports = { IN_PROD, PORT, JWT_SECRET };

module.exports.DB_URI = `mongodb+srv://${DB_USERNAME}:${encodeURIComponent(
  DB_PASSWORD
)}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

module.exports.DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

module.exports.APOLLO_OPTIONS = {
  playground: IN_PROD
    ? false
    : {
        settings: {
          'request.credentials': 'include',
        },
      },
};
