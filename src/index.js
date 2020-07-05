import cors from 'cors';
import express from 'express';
import { apolloServer } from './server';
import { connectDB } from './database';
// CONFIG VARIABLES
import { config, SESS_OPTIONS, REDIS_OPTIONS } from './config';

// SERVER
const app = express();
app.disable('x-powered-by');
// SESSIONS
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';

const RedisStore = connectRedis(session);
const store = new RedisStore({
  client: new Redis(REDIS_OPTIONS),
});
const handlerSession = session({
  store,
  ...SESS_OPTIONS,
});

const corsOpts = {
  origin: [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:4000/graphql',
  ],
  credentials: true,
};

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(handlerSession);
app.use(cors(corsOpts));

// DB Connect
connectDB();

// CONNECT APOLLO WITH EXPRESS
apolloServer.applyMiddleware({ app, cors: false });

app.listen(config.port, () => {
  console.log(
    `Server running: http://localhost:${config.port}${apolloServer.graphqlPath}`
  );
});
