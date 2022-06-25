const { ApolloServer } = require("apollo-server");
require("dotenv").config();
const mongoose = require("mongoose");
const typeDefs = require("./gaphql/typeDefs");
const resolvers = require("./gaphql/resolvers");

const port = process.env.PORT || 5000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
});
//atlas

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@web-development-2.cglha.mongodb.net/socail-media-site?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("connected to database");
    return server.listen({ port });
  })
  .then(({ url }) => {
    console.log(`Server running at: ${url}`);
  })
  .catch(err => {
    console.error(err);
  });
