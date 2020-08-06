const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { apolloServer } = require('./server');
const { connectDB } = require('./database');
// CONFIG VARIABLES
const { PORT } = require('./config');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan('common'));
app.set('trust proxy', 1);

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
