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
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@braidenscluster.3wlmf.mongodb.net/?retryWrites=true&w=majority&appName=braidensCluster`
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
