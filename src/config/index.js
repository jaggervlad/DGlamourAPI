const ONE_DAY = 1000 * 60 * 60 * 24;
const {
  // ENVIROMENT
  NODE_ENV = 'development',
  PORT = 4000,

  // SESSION EXPRESS
  SESS_SECRET = '27b0a742e2112f067faee7959d5b5ca0aacd991ce8599cb0165ca0044024212e',
  SESS_NAME = 'sid',
  SESS_LIFETIME = ONE_DAY,

  // REDIS
  REDIS_HOST = 'redis-17801.c17.us-east-1-4.ec2.cloud.redislabs.com',
  REDIS_PORT = 17801,
  REDIS_PASSWORD = '2vNxtuPLJT2V1nsZe2MJDStBk0oMyUM9',

  //DB
  DB_USERNAME = 'administrador',
  DB_PASSWORD = 'C58dIq9PihZ8wixj',
  DB_HOST = 'cluster0.mvoxt.mongodb.net',
  DB_NAME = 'dglamourapi',
} = process.env;

const IN_PROD = NODE_ENV === 'production';

module.exports = { IN_PROD, PORT };

module.exports.DB_URI = `mongodb+srv://${DB_USERNAME}:${encodeURIComponent(
  DB_PASSWORD
)}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

module.exports.DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

module.exports.REDIS_OPTIONS = {
  host: REDIS_HOST,
  port: +REDIS_PORT,
  password: REDIS_PASSWORD,
};

module.exports.SESS_OPTIONS = {
  name: SESS_NAME,
  secret: SESS_SECRET,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: +SESS_LIFETIME,
    secure: IN_PROD,
  },
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
