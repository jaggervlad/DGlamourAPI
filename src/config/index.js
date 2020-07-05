if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
import crypto from 'crypto';

const ONE_DAY = 1000 * 60 * 60 * 24;

export const config = {
  // ENVIROMENT
  mode: process.env.NODE_ENV,
  port: process.env.PORT,

  // DATABASE
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,

  // SESSION EXPRESS
  sessSecret: process.env.SESS_SECRET,
  sessName: process.env.SESS_NAME,
  sessLifetime: ONE_DAY,

  // REDIS
  redisHost:
    process.env.REDIS_HOST ||
    'redis-17801.c17.us-east-1-4.ec2.cloud.redislabs.com',
  redisPort: process.env.REDIS_PORT || 17801,
  redisPass: process.env.REDIS_PASSWORD || '2vNxtuPLJT2V1nsZe2MJDStBk0oMyUM9',
};

export const IN_PROD = config.mode === 'production';

export const DB_URI = `mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`;
export const DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

export const REDIS_OPTIONS = {
  host: config.redisHost,
  port: +config.redisPort,
  password: config.redisPass,
};

export const SESS_OPTIONS = {
  name: config.sessName,
  secret: config.sessSecret,
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: +config.sessLifetime,
    sameSite: true,
    secure: IN_PROD,
  },
};

export const APOLLO_OPTIONS = {
  playground: IN_PROD
    ? false
    : {
        settings: {
          'request.credentials': 'include',
        },
      },
};
