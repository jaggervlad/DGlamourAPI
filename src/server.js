const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');
const schemaDirectives = require('./graphql/directives');
const { APOLLO_OPTIONS } = require('./config');
const { authContext } = require('./utils/auth');
const Single = require('./utils/loaderSingle');

// Apollo
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives,
});

module.exports.apolloServer = new ApolloServer({
  ...APOLLO_OPTIONS,
  schema,
  context: async ({ req, res }) => {
    const loader = {
      single: new Single(),
    };
    let usuario = null;

    try {
      const auth = await authContext(req);
      if (auth) {
        usuario = auth;
      }
    } catch (error) {
      throw new Error('Debes Iniciar Sesion');
    }

    return { req, res, usuario, loader };
  },
});
