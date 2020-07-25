const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { apolloServer } = require('./server');
const { connectDB } = require('./database');
// CONFIG VARIABLES
const { CONFIG, SESS_OPTIONS, REDIS_OPTIONS, corsOpts } = require('./config');

// SERVER
const app = express();
app.disable('x-powered-by');
// SESSIONS
const session = require('express-session');
const connectRedis = require('connect-redis');
const Redis = require('ioredis');

const RedisStore = connectRedis(session);
const store = new RedisStore({
  client: new Redis(REDIS_OPTIONS),
});
const handlerSession = session({
  store,
  ...SESS_OPTIONS,
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('common'));
app.use(helmet());
app.use(handlerSession);

// DB Connect
connectDB();

// CONNECT APOLLO WITH EXPRESS
apolloServer.applyMiddleware({ app, cors: false });

app.listen(CONFIG.port || 4000, () => {
  console.log(
    `Server running: http://localhost:${CONFIG.port}${apolloServer.graphqlPath}`
  );
});
