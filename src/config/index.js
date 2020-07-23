if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const ONE_DAY = 1000 * 60 * 60 * 24;
let CONFIG = {};

// ENVIROMENT
CONFIG.mode = process.env.NODE_ENV;
CONFIG.port = process.env.PORT;

// SESSION EXPRESS
CONFIG.sessSecret = process.env.SESS_SECRET;
CONFIG.sessName = process.env.SESS_NAME;
CONFIG.sessLifetime = ONE_DAY;

// REDIS
CONFIG.redisHost = process.env.REDIS_HOST;
CONFIG.redisPort = process.env.REDIS_PORT;
CONFIG.redisPass = process.env.REDIS_PASSWORD;

//DB
CONFIG.dbUri = process.env.DB_URI;

module.exports.CONFIG = CONFIG;

const IN_PROD = CONFIG.mode === 'production';

module.exports.DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

module.exports.REDIS_OPTIONS = {
  host: CONFIG.redisHost,
  port: +CONFIG.redisPort,
  password: CONFIG.redisPass,
};

module.exports.SESS_OPTIONS = {
  name: CONFIG.sessName,
  secret: CONFIG.sessSecret,
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: +CONFIG.sessLifetime,
    sameSite: true,
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
module.exports.corsOpts = {
  origin: [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:4000/graphql',
  ],
  credentials: true,
};
