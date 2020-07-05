import {
  ApolloServer,
  makeExecutableSchema,
  AuthenticationError,
} from 'apollo-server-express';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/types';
import { APOLLO_OPTIONS } from './config';
import { authContext } from './utils/token';

// Apollo
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const apolloServer = new ApolloServer({
  ...APOLLO_OPTIONS,
  schema,
  context: async ({ req, res }) => {
    const token = authContext(req);
    if (token) {
      const usuario = token.payload;
      return { req, res, usuario };
    }

    return { req, res };
  },
});
