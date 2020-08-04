const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { apolloServer } = require('./server');
const { connectDB } = require('./database');
// CONFIG VARIABLES
const { PORT, SESS_OPTIONS, REDIS_OPTIONS, IN_PROD } = require('./config');

// SESSIONS
const session = require('express-session');
const connectRedis = require('connect-redis');
const Redis = require('ioredis');
const RedisStore = connectRedis(session);

const store = new RedisStore({
  client: new Redis(REDIS_OPTIONS),
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan('common'));
if (IN_PROD) app.set('trust proxy', 1);
app.use(
  session({
    store,
    ...SESS_OPTIONS,
  })
);

// DB Connect
connectDB();

// CONNECT APOLLO WITH EXPRESS
apolloServer.applyMiddleware({
  app,
  cors: {
    origin: ['https://dglamour-client.vercel.app', 'http://localhost:3000'],
    credentials: true,
  },
});

app.listen(+PORT || 4000, () => {
  console.log(
    `Server running: http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
});
