const userResolvers = require("./users");
const postResolvers = require("./post");
const commentResolvers = require("./comment");

module.exports = {
  Post: {
    likeCount: ({ likes }) => likes.length,
    commentCount: ({ comments }) => comments.length
  },
  Query: {
    ...postResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation
  }
};
